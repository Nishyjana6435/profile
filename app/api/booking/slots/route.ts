import { NextResponse } from "next/server";
import { BOOKING, candidateSlots, googleBusy, googleConfigured, removeBusy } from "@/lib/booking";

export const dynamic = "force-dynamic";

/** Free 20-minute slots for the next two weeks, UTC ISO. Busy times come from Google Calendar when connected. */
export async function GET() {
  const now = new Date();
  const candidates = candidateSlots(now);
  let busy: { start: string; end: string }[] = [];
  let source: "google" | "hours" = "hours";
  if (googleConfigured() && candidates.length) {
    try { busy = await googleBusy(new Date(candidates[0].start), new Date(candidates[candidates.length - 1].end)); source = "google"; }
    catch (e) { console.error("freebusy failed", e); }
  }
  return NextResponse.json({ slots: removeBusy(candidates, busy), source, timeZone: BOOKING.timeZone, slotMinutes: BOOKING.slotMinutes }, { headers: { "Cache-Control": "private, max-age=60" } });
}
