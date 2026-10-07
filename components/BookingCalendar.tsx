"use client";

import { useEffect, useMemo, useState } from "react";
import { WHATSAPP_URL } from "./Contact";
import { Arrow } from "./ui";

type Slot = { start: string; end: string };
type Phase = "pick" | "details" | "sending" | "done" | "error";

const dayKey = (iso: string, tz: string) => new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(iso));
const fmtDay = (iso: string, tz: string) => new Intl.DateTimeFormat("en-GB", { timeZone: tz, weekday: "short", day: "numeric", month: "short" }).format(new Date(iso));
const fmtTime = (iso: string, tz: string) => new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
const fmtFull = (iso: string, tz: string) => new Intl.DateTimeFormat("en-GB", { timeZone: tz, weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", timeZoneName: "short" }).format(new Date(iso));

/**
 * Pick a day, pick a time, leave your details. Slots come from /api/booking/slots
 * (Google Calendar busy times removed) and are shown in the visitor's time zone.
 */
export default function BookingCalendar() {
  const [tz, setTz] = useState("UTC");
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [source, setSource] = useState<"google" | "hours">("hours");
  const [day, setDay] = useState<string | null>(null);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [phase, setPhase] = useState<Phase>("pick");
  const [result, setResult] = useState<{ booked: "google" | "email"; meet: string | null } | null>(null);
  const [reason, setReason] = useState("");
  const [v, setV] = useState({ name: "", email: "", company: "", notes: "", website: "" });
  const set = (k: keyof typeof v) => (e: { target: { value: string } }) => setV((x) => ({ ...x, [k]: e.target.value }));

  useEffect(() => {
    // state is set from the fetch callback, never synchronously in the effect body
    fetch("/api/booking/slots")
      .then((r) => r.json())
      .then((d) => { setTz(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"); setSlots(d.slots ?? []); setSource(d.source ?? "hours"); })
      .catch(() => { setTz(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"); setSlots([]); });
  }, []);

  const days = useMemo(() => {
    const map = new Map<string, Slot[]>();
    for (const s of slots ?? []) { const k = dayKey(s.start, tz); map.set(k, [...(map.get(k) ?? []), s]); }
    return [...map.entries()];
  }, [slots, tz]);
  const activeDay = day ?? days[0]?.[0] ?? null; // first available day until the visitor picks one

  const book = async () => {
    if (!slot) return;
    setPhase("sending");
    try {
      const r = await fetch("/api/booking", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...v, start: slot.start, timeZone: tz }) });
      const d = await r.json();
      if (r.ok) { setResult({ booked: d.booked, meet: d.meet }); setPhase("done"); }
      else { setReason(d.reason === "taken" ? "That slot was just taken. Pick another." : d.reason === "unconfigured" ? "Booking is not wired up on this server yet. Message me on WhatsApp instead." : "That did not go through. Try again or use WhatsApp."); setPhase("error"); }
    } catch { setReason("That did not go through. Try again or use WhatsApp."); setPhase("error"); }
  };

  const zones = useMemo(() => { const base = ["Asia/Colombo", "Europe/London", "Europe/Berlin", "America/New_York", "America/Los_Angeles", "Asia/Singapore", "Australia/Sydney", "Asia/Dubai"]; return tz && !base.includes(tz) ? [tz, ...base] : base; }, [tz]);

  if (phase === "done" && slot && result) {
    return (
      <div className="rounded-2xl border border-brand-500/50 bg-brand-500/10 p-6 sm:p-8">
        <p className="eyebrow text-brand-400">{result.booked === "google" ? "Booked" : "Request received"}</p>
        <h3 className="display-sm mt-3 text-2xl text-white">{fmtFull(slot.start, tz)}</h3>
        <p className="mt-3 text-sm leading-6 text-neutral-300">
          {result.booked === "google" ? `A calendar invite is on its way to ${v.email}${result.meet ? " with the Google Meet link" : ""}.` : `I will confirm this time by email within one business day.`}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          {result.meet && <a href={result.meet} target="_blank" rel="noopener noreferrer" className="btn btn--solid"><span className="btn-ico"><Arrow className="h-3.5 w-3.5" /></span><span>Open Meet link</span></a>}
          <a href={`${WHATSAPP_URL.split("?")[0]}?text=${encodeURIComponent(`Hi Nishy, I just booked ${fmtFull(slot.start, tz)}.`)}`} target="_blank" rel="noopener noreferrer" className="btn"><span className="btn-ico"><Arrow className="h-3.5 w-3.5" /></span><span>Say hi on WhatsApp</span></a>
        </div>
      </div>
    );
  }

  const field = "w-full rounded-lg border border-white/15 bg-[#121212] px-3 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-brand-400 focus:outline-none";
  return (
    <div className="min-w-0 rounded-2xl border hairline bg-[#161616] p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow text-white">Book a 20-minute discovery call</p>
          <p className="mt-1 text-xs text-neutral-500">{source === "google" ? "Live availability from my calendar" : "Working hours, Monday to Friday"} · shown in your time</p>
        </div>
        <label className="label flex items-center gap-2 text-neutral-400">
          Time zone
          <select value={tz} onChange={(e) => { setTz(e.target.value); setDay(null); setSlot(null); }} className="rounded-md border border-white/15 bg-[#121212] px-2 py-1 font-sans text-xs normal-case tracking-normal text-white">
            {zones.map((z) => <option key={z}>{z}</option>)}
          </select>
        </label>
      </div>

      {slots === null ? (
        <p className="mt-6 text-sm text-neutral-400">Checking the calendar…</p>
      ) : days.length === 0 ? (
        <p className="mt-6 text-sm text-neutral-400">No free slots in the next two weeks. <a href={WHATSAPP_URL} className="text-white underline underline-offset-4">Message me</a> and we will find one.</p>
      ) : (
        <>
          {/* days */}
          <div className="mt-5 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none]" role="tablist" aria-label="Days">
            {days.map(([k, list]) => {
              const on = k === activeDay;
              return (
                <button key={k} role="tab" aria-selected={on} type="button" onClick={() => { setDay(k); setSlot(null); setPhase("pick"); }} className={`shrink-0 rounded-xl border px-3 py-2 text-left transition-colors ${on ? "border-brand-500 bg-brand-500/15 text-white" : "border-white/10 text-neutral-300 hover:border-white/30"}`}>
                  <span className="block text-sm font-semibold">{fmtDay(list[0].start, tz)}</span>
                  <span className="label mt-0.5 block text-neutral-500">{list.length} slot{list.length === 1 ? "" : "s"}</span>
                </button>
              );
            })}
          </div>
          {/* times */}
          <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6" role="group" aria-label="Times">
            {(days.find(([k]) => k === activeDay)?.[1] ?? []).map((s) => {
              const on = slot?.start === s.start;
              return (
                <button key={s.start} type="button" onClick={() => { setSlot(s); setPhase("details"); }} aria-pressed={on} className={`rounded-lg border px-3 py-2 font-mono text-sm transition-colors ${on ? "border-brand-500 bg-brand-500 text-[#0b0b0c]" : "border-white/15 text-white hover:border-brand-400"}`}>
                  {fmtTime(s.start, tz)}
                </button>
              );
            })}
          </div>
        </>
      )}

      {slot && (phase === "details" || phase === "sending" || phase === "error") && (
        <form onSubmit={(e) => { e.preventDefault(); book(); }} className="mt-6 border-t hairline pt-6">
          <p className="text-sm text-neutral-300"><span className="text-white">{fmtFull(slot.start, tz)}</span>, 20 minutes on Google Meet.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <label className="block"><span className="label text-neutral-400">Name</span><input required value={v.name} onChange={set("name")} className={`${field} mt-1.5`} autoComplete="name" /></label>
            <label className="block"><span className="label text-neutral-400">Email</span><input required type="email" value={v.email} onChange={set("email")} className={`${field} mt-1.5`} autoComplete="email" /></label>
            <label className="block"><span className="label text-neutral-400">Company</span><input value={v.company} onChange={set("company")} className={`${field} mt-1.5`} autoComplete="organization" /></label>
          </div>
          <label className="mt-4 block"><span className="label text-neutral-400">What should run itself? Tools and budget band help too.</span><textarea rows={3} value={v.notes} onChange={set("notes")} className={`${field} mt-1.5`} placeholder="e.g. Support triage across Gmail and Slack, budget around $5k." /></label>
          <input tabIndex={-1} autoComplete="off" value={v.website} onChange={set("website")} className="hidden" aria-hidden="true" name="website" />
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button type="submit" disabled={phase === "sending"} className="btn btn--solid disabled:opacity-60"><span className="btn-ico"><Arrow className="h-3.5 w-3.5" /></span><span>{phase === "sending" ? "Booking…" : "Confirm booking"}</span></button>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="label text-neutral-400 hover:text-white">or WhatsApp instead</a>
          </div>
          {phase === "error" && <p className="mt-3 text-xs text-[#ff7d8e]">{reason}</p>}
        </form>
      )}
    </div>
  );
}
