/**
 * Sliding-window limits per visitor (IP + browser session), kept in memory.
 * On Vercel Fluid Compute instances are reused, so this holds across most
 * requests; it is a per-instance guard, backed by the payload caps.
 */
type Hit = { at: number; tokens: number };
const store = new Map<string, Hit[]>();

export const RATE = {
  perMinute: 8,
  perHour: 40,
  tokensPerHour: 25_000,
  tokensPerDay: 60_000,
};

export function checkRate(key: string, tokens: number): { ok: true } | { ok: false; retryAfter: number; reason: string } {
  const now = Date.now();
  const day = 86_400_000;
  const hits = (store.get(key) ?? []).filter((h) => now - h.at < day);
  const inLast = (ms: number) => hits.filter((h) => now - h.at < ms);
  const sum = (hs: Hit[]) => hs.reduce((n, h) => n + h.tokens, 0);

  const minute = inLast(60_000);
  const hour = inLast(3_600_000);
  if (minute.length >= RATE.perMinute) return { ok: false, retryAfter: Math.ceil((60_000 - (now - minute[0].at)) / 1000), reason: "Too many messages. Please wait a moment." };
  if (hour.length >= RATE.perHour || sum(hour) + tokens > RATE.tokensPerHour)
    return { ok: false, retryAfter: hour.length ? Math.ceil((3_600_000 - (now - hour[0].at)) / 1000) : 3600, reason: "You have reached the hourly chat limit." };
  if (sum(hits) + tokens > RATE.tokensPerDay) return { ok: false, retryAfter: 3600, reason: "You have reached today's chat limit." };

  hits.push({ at: now, tokens });
  store.set(key, hits);
  if (store.size > 5000) {
    for (const [k, v] of store) if (!v.length || now - v[v.length - 1].at > day) store.delete(k);
  }
  return { ok: true };
}

/** Record the answer's size against the same visitor budget. */
export function addTokens(key: string, tokens: number) {
  const hits = store.get(key);
  if (hits?.length) hits[hits.length - 1].tokens += tokens;
}
