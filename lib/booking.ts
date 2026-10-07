/**
 * Discovery-call booking: availability rules, slot generation against Google
 * Calendar busy times, and event creation. Google is talked to over REST with
 * a refresh token, so there are no SDK dependencies.
 */
export const BOOKING = {
  timeZone: "Asia/Colombo",       // working hours are expressed in this zone
  days: [1, 2, 3, 4, 5],          // Monday to Friday
  hours: { start: "09:00", end: "18:00" },
  slotMinutes: 20,
  stepMinutes: 30,                // a slot can start every 30 minutes
  bufferMinutes: 10,              // breathing room before and after existing events
  leadHours: 12,                  // nothing sooner than this
  horizonDays: 14,
  maxPerDay: 6,
  title: "Discovery call with Nishy",
} as const;

export type Slot = { start: string; end: string }; // ISO, UTC

/* ---------- time zone maths without a library ---------- */
function offsetMinutes(tz: string, at: Date): number {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: tz, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" }).formatToParts(at);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
  return Math.round((asUtc - at.getTime()) / 60000);
}
/** The instant at which the given wall-clock time happens in `tz`. */
function zoned(y: number, m: number, d: number, hh: number, mm: number, tz: string): Date {
  const guess = new Date(Date.UTC(y, m - 1, d, hh, mm));
  const off = offsetMinutes(tz, guess);
  const real = new Date(guess.getTime() - off * 60000);
  const off2 = offsetMinutes(tz, real); // second pass handles DST edges
  return off2 === off ? real : new Date(guess.getTime() - off2 * 60000);
}
function ymdIn(tz: string, at: Date): { y: number; m: number; d: number; dow: number } {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit", weekday: "short" }).formatToParts(at);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const dow = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { y: Number(get("year")), m: Number(get("month")), d: Number(get("day")), dow };
}

/* ---------- slots ---------- */
export function candidateSlots(now = new Date()): Slot[] {
  const out: Slot[] = [];
  const [sh, sm] = BOOKING.hours.start.split(":").map(Number);
  const [eh, em] = BOOKING.hours.end.split(":").map(Number);
  const earliest = now.getTime() + BOOKING.leadHours * 3600_000;
  for (let i = 0; i <= BOOKING.horizonDays; i++) {
    const day = new Date(now.getTime() + i * 86_400_000);
    const { y, m, d, dow } = ymdIn(BOOKING.timeZone, day);
    if (!(BOOKING.days as readonly number[]).includes(dow)) continue;
    const open = zoned(y, m, d, sh, sm, BOOKING.timeZone).getTime();
    const close = zoned(y, m, d, eh, em, BOOKING.timeZone).getTime();
    for (let t = open; t + BOOKING.slotMinutes * 60000 <= close; t += BOOKING.stepMinutes * 60000) {
      if (t < earliest) continue;
      out.push({ start: new Date(t).toISOString(), end: new Date(t + BOOKING.slotMinutes * 60000).toISOString() });
    }
  }
  return out;
}

export function removeBusy(slots: Slot[], busy: { start: string; end: string }[]): Slot[] {
  const pad = BOOKING.bufferMinutes * 60000;
  const blocks = busy.map((b) => ({ s: new Date(b.start).getTime() - pad, e: new Date(b.end).getTime() + pad }));
  const free = slots.filter((sl) => { const s = new Date(sl.start).getTime(), e = new Date(sl.end).getTime(); return !blocks.some((b) => s < b.e && e > b.s); });
  // cap per day (in the host's zone), spread evenly across the free hours rather than bunched at the start
  const byDay = new Map<string, Slot[]>();
  for (const sl of free) { const { y, m, d } = ymdIn(BOOKING.timeZone, new Date(sl.start)); const k = `${y}-${m}-${d}`; byDay.set(k, [...(byDay.get(k) ?? []), sl]); }
  const out: Slot[] = [];
  for (const list of byDay.values()) {
    if (list.length <= BOOKING.maxPerDay) { out.push(...list); continue; }
    const step = (list.length - 1) / (BOOKING.maxPerDay - 1);
    for (let i = 0; i < BOOKING.maxPerDay; i++) out.push(list[Math.round(i * step)]);
  }
  return out;
}

/* ---------- Google Calendar over REST ---------- */
const g = () => ({ id: process.env.GOOGLE_CLIENT_ID, secret: process.env.GOOGLE_CLIENT_SECRET, refresh: process.env.GOOGLE_REFRESH_TOKEN, calendar: process.env.GOOGLE_CALENDAR_ID || "primary" });
export const googleConfigured = () => { const c = g(); return Boolean(c.id && c.secret && c.refresh); };

async function accessToken(): Promise<string> {
  const c = g();
  const r = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ client_id: c.id!, client_secret: c.secret!, refresh_token: c.refresh!, grant_type: "refresh_token" }) });
  if (!r.ok) throw new Error(`google token ${r.status}`);
  return (await r.json()).access_token as string;
}

export async function googleBusy(from: Date, to: Date): Promise<{ start: string; end: string }[]> {
  const token = await accessToken(); const cal = g().calendar;
  const r = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ timeMin: from.toISOString(), timeMax: to.toISOString(), items: [{ id: cal }] }) });
  if (!r.ok) throw new Error(`google freebusy ${r.status}`);
  const data = await r.json();
  return (data.calendars?.[cal]?.busy ?? []) as { start: string; end: string }[];
}

export async function googleCreateEvent(slot: Slot, guest: { name: string; email: string; company?: string; notes?: string; timeZone?: string }) {
  const token = await accessToken(); const cal = g().calendar;
  const description = [`Discovery call booked on nishyai.com.`, ``, `Name: ${guest.name}`, guest.company ? `Company: ${guest.company}` : null, `Email: ${guest.email}`, guest.timeZone ? `Guest time zone: ${guest.timeZone}` : null, ``, guest.notes ? `What to discuss:\n${guest.notes}` : null].filter((l) => l !== null).join("\n");
  const body = {
    summary: `${BOOKING.title}: ${guest.name}${guest.company ? ` (${guest.company})` : ""}`,
    description,
    start: { dateTime: slot.start }, end: { dateTime: slot.end },
    attendees: [{ email: guest.email, displayName: guest.name }],
    conferenceData: { createRequest: { requestId: `nishy-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, conferenceSolutionKey: { type: "hangoutsMeet" } } },
    reminders: { useDefault: false, overrides: [{ method: "email", minutes: 60 }, { method: "popup", minutes: 10 }] },
  };
  const r = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(cal)}/events?conferenceDataVersion=1&sendUpdates=all`, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error(`google insert ${r.status} ${await r.text()}`);
  const ev = await r.json();
  const meet = ev.hangoutLink || ev.conferenceData?.entryPoints?.find((e: { entryPointType: string }) => e.entryPointType === "video")?.uri;
  return { id: ev.id as string, htmlLink: ev.htmlLink as string, meet: meet as string | undefined };
}
