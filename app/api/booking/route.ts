import { NextRequest, NextResponse } from "next/server";
import { BOOKING, candidateSlots, googleBusy, googleConfigured, googleCreateEvent, removeBusy } from "@/lib/booking";
import { mailCreds, sendMail } from "@/lib/mail";

const hits = new Map<string, number[]>();
const tooMany = (key: string) => { const now = Date.now(); const l = (hits.get(key) ?? []).filter((t) => now - t < 3_600_000); if (l.length >= 4) return true; l.push(now); hits.set(key, l); return false; };

const fmt = (iso: string, tz: string) => new Intl.DateTimeFormat("en-GB", { timeZone: tz, weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZoneName: "short" }).format(new Date(iso));

/** Books a slot: re-checks it is still free, creates the Google event with a Meet link and invites, and emails both sides. */
export async function POST(request: NextRequest) {
  let body: Record<string, string>;
  try { body = await request.json(); } catch { return NextResponse.json({ ok: false, reason: "bad json" }, { status: 400 }); }
  if (body.website) return NextResponse.json({ ok: true });
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (tooMany(ip)) return NextResponse.json({ ok: false, reason: "rate" }, { status: 429 });

  const clean = (v: unknown, max = 1200) => String(v ?? "").trim().slice(0, max);
  const start = clean(body.start, 40), name = clean(body.name, 120), email = clean(body.email, 200), company = clean(body.company, 160), notes = clean(body.notes), tz = clean(body.timeZone, 80) || "UTC";
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !start) return NextResponse.json({ ok: false, reason: "invalid" }, { status: 400 });

  // the slot must be one we offer, and still free
  const candidates = candidateSlots();
  const slot = candidates.find((s) => s.start === start);
  if (!slot) return NextResponse.json({ ok: false, reason: "slot" }, { status: 409 });
  let busy: { start: string; end: string }[] = [];
  if (googleConfigured()) { try { busy = await googleBusy(new Date(slot.start), new Date(slot.end)); } catch (e) { console.error("freebusy failed", e); } }
  if (!removeBusy([slot], busy).length) return NextResponse.json({ ok: false, reason: "taken" }, { status: 409 });

  let event: { htmlLink?: string; meet?: string } = {};
  let booked: "google" | "email" = "email";
  if (googleConfigured()) {
    try { event = await googleCreateEvent(slot, { name, email, company, notes, timeZone: tz }); booked = "google"; }
    catch (e) { console.error("google insert failed", e); }
  }

  const whenHost = fmt(slot.start, BOOKING.timeZone), whenGuest = fmt(slot.start, tz);
  const { to } = mailCreds();
  const lines = [`Discovery call ${booked === "google" ? "booked" : "requested"} on nishyai.com`, ``, `When: ${whenHost} (${whenGuest} for the guest)`, `Name: ${name}`, `Email: ${email}`, company ? `Company: ${company}` : null, event.meet ? `Meet: ${event.meet}` : null, event.htmlLink ? `Event: ${event.htmlLink}` : null, ``, notes ? `What to discuss:\n${notes}` : null, ``, `IP: ${ip}`].filter((l) => l !== null).join("\n");
  try {
    if (to) await sendMail({ to, subject: `${booked === "google" ? "Booked" : "Booking request"}: ${name} · ${whenHost}`, text: lines, replyTo: `"${name}" <${email}>` });
    await sendMail({ to: email, subject: `${booked === "google" ? "Confirmed" : "Received"}: discovery call with Nishy, ${whenGuest}`, text: [`Hi ${name.split(" ")[0]},`, ``, booked === "google" ? `Your 20-minute discovery call is booked for ${whenGuest}. A calendar invite${event.meet ? " with a Google Meet link" : ""} is on its way from Google.` : `Thanks for the request for ${whenGuest}. I will confirm by email within one business day.`, event.meet ? `` : null, event.meet ? `Meet link: ${event.meet}` : null, ``, `If you need to move it, reply to this email.`, ``, `Nishy`, `nishyai.com`].filter((l) => l !== null).join("\n") });
  } catch (e) { console.error("booking mail failed", e); if (booked === "email") return NextResponse.json({ ok: false, reason: "unconfigured" }, { status: 503 }); }

  return NextResponse.json({ ok: true, booked, start: slot.start, end: slot.end, meet: event.meet ?? null, event: event.htmlLink ?? null });
}
