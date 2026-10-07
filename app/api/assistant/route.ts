import { NextResponse } from "next/server";
import { compact, estimateTokens, LIMITS, toAgentMessages, type ChatMessage } from "@/lib/assistant/compact";
import { addTokens, checkRate } from "@/lib/assistant/rate-limit";

const AGENT_BASE = "https://create-your-agent.nishy.space/v1/agents";

const NAME_HINT = /AGENT|ASSIST|CHAT|NISHY_AI/i;

/** Env var names (never values) that look agent-related, for diagnostics. */
function candidateNames(): string[] {
  return Object.keys(process.env).filter((k) => NAME_HINT.test(k) && !/^VERCEL_|^NEXT_|USER_AGENT/i.test(k)).sort();
}

/** The secret: a known name, otherwise any agent-ish var holding an Agent Studio key. */
function agentSecret(): string | undefined {
  const known = process.env.AGENT_SECRET ?? process.env.AGENT_API_KEY ?? process.env.AGENT_KEY ?? process.env.ASSISTANT_AGENT_SECRET;
  if (known) return known.trim();
  for (const k of candidateNames()) {
    const v = process.env[k]?.trim();
    if (v && (/^ak_/.test(v) || /SECRET|KEY|TOKEN/i.test(k)) && !/^https?:\/\//.test(v)) return v;
  }
  return undefined;
}

/** Accepts a full invoke URL, a base URL or just the agent slug, under a known or agent-ish name. */
function agentEndpoint(): string | null {
  let raw = process.env.AGENT_URL ?? process.env.AGENT_ENDPOINT ?? process.env.AGENT ?? process.env.AGENT_SLUG ?? process.env.ASSISTANT_AGENT;
  if (!raw) {
    const secret = agentSecret();
    for (const k of candidateNames()) {
      const v = process.env[k]?.trim();
      if (!v || v === secret || /SECRET|KEY|TOKEN/i.test(k)) continue;
      if (/^https?:\/\//.test(v) || /^[a-z0-9][a-z0-9-]{1,80}$/i.test(v)) {
        raw = v;
        break;
      }
    }
  }
  if (!raw) return null;
  const v = raw.trim();
  if (/^https?:\/\//.test(v)) return v.endsWith("/invoke") ? v : `${v.replace(/\/$/, "")}/invoke`;
  return `${AGENT_BASE}/${v.replace(/^\/+|\/+$/g, "")}/invoke`;
}

function clientKey(req: Request, sessionId: string) {
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || req.headers.get("x-real-ip") || "local";
  return `${ip}:${sessionId.slice(0, 64)}`;
}

function isMessage(m: unknown): m is ChatMessage {
  return !!m && typeof m === "object" && ((m as ChatMessage).role === "user" || (m as ChatMessage).role === "assistant") && typeof (m as ChatMessage).content === "string";
}

/** Lets the widget hide itself when the agent isn't configured. */
export function GET() {
  const endpoint = agentEndpoint();
  const secret = agentSecret();
  return NextResponse.json(
    {
      configured: Boolean(endpoint && secret),
      endpointFound: Boolean(endpoint),
      secretFound: Boolean(secret),
      agentHost: endpoint ? new URL(endpoint).host : null,
      envNamesSeen: candidateNames(), // names only, never values
    },
    { headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=3600" } },
  );
}

export async function POST(req: Request) {
  const endpoint = agentEndpoint();
  const secret = agentSecret();
  if (!endpoint || !secret) {
    return NextResponse.json({ error: "The assistant is not configured yet." }, { status: 503 });
  }

  let body: { messages?: unknown; summary?: unknown; sessionId?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const history = Array.isArray(body.messages) ? body.messages.filter(isMessage).slice(-60) : [];
  const last = history[history.length - 1];
  if (!last || last.role !== "user" || !last.content.trim()) {
    return NextResponse.json({ error: "Send a message to start." }, { status: 400 });
  }
  if (last.content.length > LIMITS.maxMessageChars) {
    return NextResponse.json({ error: `Please keep messages under ${LIMITS.maxMessageChars} characters.` }, { status: 413 });
  }
  const sessionId = typeof body.sessionId === "string" && body.sessionId ? body.sessionId : "anon";
  const incomingSummary = typeof body.summary === "string" ? body.summary.slice(0, LIMITS.maxSummaryChars) : "";

  // Compact again server-side so an old or tampered client can't send a huge history.
  const { summary, recent } = compact(history, incomingSummary);
  const messages = toAgentMessages(recent, summary);
  const inTokens = estimateTokens(messages.reduce((n, m) => n + m.content.length, 0));

  const key = clientKey(req, sessionId);
  const rate = checkRate(key, inTokens);
  if (!rate.ok) {
    return NextResponse.json({ error: rate.reason, retryAfter: rate.retryAfter }, { status: 429, headers: { "Retry-After": String(rate.retryAfter) } });
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
      signal: AbortSignal.timeout(45_000),
    });
    if (res.status === 402) return NextResponse.json({ error: "The assistant is taking a short break. Please reach Nishy on WhatsApp." }, { status: 503 });
    if (res.status === 429) return NextResponse.json({ error: "The assistant is busy right now. Please try again in a minute." }, { status: 429 });
    if (!res.ok) return NextResponse.json({ error: "The assistant could not answer just now. Please try again." }, { status: 502 });

    const data = (await res.json()) as { output?: string; blocked?: boolean };
    const output = (data.output ?? "").trim() || "Sorry, I don't have an answer for that.";
    addTokens(key, estimateTokens(output.length));
    return NextResponse.json({ output, blocked: Boolean(data.blocked), summary }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "The assistant timed out. Please try again." }, { status: 504 });
  }
}
