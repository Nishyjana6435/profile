import { NextRequest, NextResponse } from "next/server";
import { mailCreds, sendMail } from "@/lib/mail";

/**
 * Discovery-call requests from the booking form. Sends one email to Nishy
 * through the Gmail account configured in the environment, with the visitor
 * as reply-to. Honeypot and a small per-instance rate limit keep bots out.
 */
const hits = new Map<string, number[]>();

function tooMany(key: string) {
  const now = Date.now();
  const list = (hits.get(key) ?? []).filter((t) => now - t < 3_600_000);
  if (list.length >= 5) return true;
  list.push(now); hits.set(key, list);
  return false;
}
export async function POST(request: NextRequest) {
  const { user, pass, to } = mailCreds();
  if (!user || !pass || !to) return NextResponse.json({ ok: false, reason: "unconfigured" }, { status: 503 });

  let body: Record<string, string>;
  try { body = await request.json(); } catch { return NextResponse.json({ ok: false, reason: "bad json" }, { status: 400 }); }
  if (body.website) return NextResponse.json({ ok: true }); // honeypot filled: pretend success

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (tooMany(ip)) return NextResponse.json({ ok: false, reason: "rate" }, { status: 429 });

  const clean = (v: unknown, max = 1200) => String(v ?? "").trim().slice(0, max);
  const name = clean(body.name, 120), email = clean(body.email, 200), company = clean(body.company, 160);
  const process_ = clean(body.process), tools = clean(body.tools, 400), budget = clean(body.budget, 80), when = clean(body.when, 200);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !process_) return NextResponse.json({ ok: false, reason: "invalid" }, { status: 400 });

  const text = [
    `New discovery-call request from nishyai.com`, ``,
    `Name:     ${name}`, `Email:    ${email}`, company ? `Company:  ${company}` : null, ``,
    `What should run itself:`, process_, ``,
    `Tools in play: ${tools || "not given"}`, `Budget band:   ${budget || "not given"}`, `Preferred time: ${when || "not given"}`, ``,
    `IP: ${ip}`,
  ].filter((l) => l !== null).join("\n");

  try {
    await sendMail({ to, replyTo: `"${name}" <${email}>`, subject: `Discovery call: ${name}${company ? ` (${company})` : ""}`, text });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("lead mail failed", e);
    return NextResponse.json({ ok: false, reason: "send" }, { status: 502 });
  }
}
