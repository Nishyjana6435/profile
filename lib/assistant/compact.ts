/**
 * History compaction shared by the browser and the server.
 * The visible transcript can be long; what we send to the agent is not:
 * the last few turns verbatim plus a short rolling summary of everything older.
 */
export type Role = "user" | "assistant";
export interface ChatMessage {
  role: Role;
  content: string;
}

export const LIMITS = {
  maxMessageChars: 800, // per visitor message
  keepRecent: 8, // turns sent verbatim
  compactAfter: 12, // start compacting once history is longer than this
  maxSummaryChars: 1400,
  maxPayloadChars: 7000, // hard cap on everything sent to the agent (~1.75k tokens)
};

const clip = (s: string, n: number) => {
  const t = s.replace(/\s+/g, " ").trim();
  return t.length > n ? `${t.slice(0, n - 1)}…` : t;
};

/** Fold older messages into the running summary; keep the newest verbatim. */
export function compact(history: ChatMessage[], summary = ""): { summary: string; recent: ChatMessage[] } {
  if (history.length <= LIMITS.compactAfter) return { summary, recent: history };
  const cut = history.length - LIMITS.keepRecent;
  const older = history.slice(0, cut);
  const lines = older.map((m) => (m.role === "user" ? `Visitor asked: ${clip(m.content, 140)}` : `Assistant said: ${clip(m.content, 160)}`));
  let next = [summary, ...lines].filter(Boolean).join("\n");
  if (next.length > LIMITS.maxSummaryChars) next = `…${next.slice(next.length - LIMITS.maxSummaryChars)}`;
  return { summary: next, recent: history.slice(cut) };
}

/** Build the exact payload for the agent, enforcing the size budget. */
export function toAgentMessages(recent: ChatMessage[], summary: string): ChatMessage[] {
  const msgs = recent.map((m) => ({ role: m.role, content: clip(m.content, m.role === "user" ? LIMITS.maxMessageChars : 1600) }));
  // Drop oldest turns until we fit the budget, but always keep the latest visitor message.
  const size = () => msgs.reduce((n, m) => n + m.content.length, 0) + summary.length;
  while (msgs.length > 1 && size() > LIMITS.maxPayloadChars) msgs.shift();
  while (msgs.length && msgs[0].role !== "user") msgs.shift();
  if (summary && msgs.length) {
    msgs[0] = { role: "user", content: `[Context from earlier in this chat]\n${summary}\n\n[Current message]\n${msgs[0].content}` };
  }
  return msgs;
}

export const estimateTokens = (chars: number) => Math.ceil(chars / 4);
