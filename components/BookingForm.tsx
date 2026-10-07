"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { WHATSAPP_URL } from "./Contact";
import { Arrow } from "./ui";

const BUDGETS = ["Under $2k", "$2k to $5k", "$5k to $15k", "$15k to $40k", "Over $40k", "Not sure yet"];

/**
 * Three questions and a 20-minute slot. Posts to /api/lead, which emails Nishy.
 * If email is not configured, the same answers open as a prefilled WhatsApp message.
 */
export default function BookingForm({ compact = false }: { compact?: boolean }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "fallback" | "error">("idle");
  const [values, setValues] = useState({ name: "", email: "", company: "", process: "", tools: "", budget: "", when: "", website: "" });
  const set = (k: keyof typeof values) => (e: { target: { value: string } }) => setValues((v) => ({ ...v, [k]: e.target.value }));

  const whatsapp = () => {
    const msg = `Hi Nishy, I'd like a 20-minute discovery call.\n\nWhat should run itself: ${values.process}\nTools: ${values.tools || "-"}\nBudget band: ${values.budget || "-"}\nPreferred time: ${values.when || "-"}\n\n${values.name}${values.company ? `, ${values.company}` : ""}`;
    return `${WHATSAPP_URL.split("?")[0]}?text=${encodeURIComponent(msg)}`;
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setState("sending");
    try {
      const r = await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      if (r.ok) setState("sent");
      else if (r.status === 503) setState("fallback");
      else setState("error");
    } catch { setState("error"); }
  };

  if (state === "sent") {
    return (
      <div className="rounded-2xl border border-brand-500/50 bg-brand-500/10 p-6">
        <p className="eyebrow text-brand-400">Request received</p>
        <p className="mt-2 text-lg font-semibold text-white">Thanks, {values.name.split(" ")[0]}. You will hear from me within one business day with a slot.</p>
        <p className="mt-2 text-sm text-neutral-400">If it is urgent, <a href={whatsapp()} target="_blank" rel="noopener noreferrer" className="text-white underline underline-offset-4">message me on WhatsApp</a>.</p>
      </div>
    );
  }

  const field = "w-full rounded-lg border border-white/15 bg-[#121212] px-3 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-brand-400 focus:outline-none";
  return (
    <form onSubmit={submit} className={`rounded-2xl border hairline bg-[#161616] ${compact ? "p-5" : "p-6 sm:p-8"}`} aria-label="Book a discovery call">
      <div className="flex items-center justify-between gap-3">
        <p className="eyebrow text-white">Book a 20-minute discovery call</p>
        <span className="label text-neutral-500">Free · no prep needed</span>
      </div>
      <p className="mt-2 text-sm leading-6 text-neutral-400">Three questions, then I reply within a business day with a slot and an honest first take: product, custom build, or neither.</p>

      <div className="mt-5 grid gap-4">
        <label className="block">
          <span className="label text-neutral-400">(01) What process should run itself?</span>
          <textarea required rows={3} value={values.process} onChange={set("process")} placeholder="e.g. Every support email gets triaged, summarised and routed before anyone reads it." className={`${field} mt-1.5`} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="label text-neutral-400">(02) Which tools are in play?</span>
            <input value={values.tools} onChange={set("tools")} placeholder="Slack, HubSpot, Google Sheets, your API…" className={`${field} mt-1.5`} />
          </label>
          <label className="block">
            <span className="label text-neutral-400">(03) Budget band</span>
            <select value={values.budget} onChange={set("budget")} className={`${field} mt-1.5`}>
              <option value="">Choose one</option>
              {BUDGETS.map((b) => <option key={b}>{b}</option>)}
            </select>
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block"><span className="label text-neutral-400">Name</span><input required value={values.name} onChange={set("name")} className={`${field} mt-1.5`} autoComplete="name" /></label>
          <label className="block"><span className="label text-neutral-400">Email</span><input required type="email" value={values.email} onChange={set("email")} className={`${field} mt-1.5`} autoComplete="email" /></label>
          <label className="block"><span className="label text-neutral-400">Company</span><input value={values.company} onChange={set("company")} className={`${field} mt-1.5`} autoComplete="organization" /></label>
        </div>
        <label className="block">
          <span className="label text-neutral-400">Preferred time and time zone</span>
          <input value={values.when} onChange={set("when")} placeholder="e.g. Tue or Wed afternoon, London time" className={`${field} mt-1.5`} />
        </label>
        <input tabIndex={-1} autoComplete="off" value={values.website} onChange={set("website")} className="hidden" aria-hidden="true" name="website" />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {state === "fallback" ? (
          <a href={whatsapp()} target="_blank" rel="noopener noreferrer" className="btn btn--solid"><span className="btn-ico"><Arrow className="h-3.5 w-3.5" /></span><span>Send on WhatsApp</span></a>
        ) : (
          <button type="submit" disabled={state === "sending"} className="btn btn--solid disabled:opacity-60"><span className="btn-ico"><Arrow className="h-3.5 w-3.5" /></span><span>{state === "sending" ? "Sending…" : "Request a slot"}</span></button>
        )}
        {!compact && <Link href="/book" className="btn"><span className="btn-ico"><Arrow className="h-3.5 w-3.5" /></span><span>Pick a time on the calendar</span></Link>}
        <a href={whatsapp()} target="_blank" rel="noopener noreferrer" className="label text-neutral-400 hover:text-white">or WhatsApp instead</a>
      </div>
      {state === "fallback" && <p className="mt-3 text-xs text-neutral-400">Email is not set up on this server, so the answers are packed into a WhatsApp message instead.</p>}
      {state === "error" && <p className="mt-3 text-xs text-[#ff7d8e]">That did not send. Try again, or use WhatsApp.</p>}
    </form>
  );
}
