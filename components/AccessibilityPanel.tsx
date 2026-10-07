"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { A11Y_DEFAULTS, applyPrefs, prefsServerSnapshot, prefsSnapshot, subscribePrefs, type A11yPrefs } from "@/lib/a11y";

const OPTIONS: { key: keyof A11yPrefs; label: string; hint: string }[] = [
  { key: "motion", label: "Reduce motion", hint: "Stops animations, cursor effects and inertial scrolling" },
  { key: "contrast", label: "High contrast", hint: "Black canvas, brighter text and lines" },
  { key: "text", label: "Larger text", hint: "Scales the type up by a fifth" },
  { key: "font", label: "Plain headings", hint: "Headings in the body font instead of the display face" },
  { key: "links", label: "Underline links", hint: "Every link gets an underline" },
  { key: "focus", label: "Strong focus ring", hint: "A thick outline follows keyboard focus" },
];

/** Floating accessibility switchboard, bottom-left. Preferences persist and apply before paint on return visits. */
export default function AccessibilityPanel() {
  const [open, setOpen] = useState(false);
  // the saved JSON is the store; the server snapshot is empty so hydration matches, then the client catches up
  const raw = useSyncExternalStore(subscribePrefs, prefsSnapshot, prefsServerSnapshot);
  let current: A11yPrefs = A11Y_DEFAULTS;
  try { current = { ...A11Y_DEFAULTS, ...(JSON.parse(raw || "{}") as Partial<A11yPrefs>) }; } catch {}
  const panel = useRef<HTMLDivElement | null>(null);
  const btn = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); btn.current?.focus(); } };
    const onClick = (e: MouseEvent) => { if (panel.current && !panel.current.contains(e.target as Node) && !btn.current?.contains(e.target as Node)) setOpen(false); };
    window.addEventListener("keydown", onKey); window.addEventListener("pointerdown", onClick);
    panel.current?.querySelector<HTMLElement>("input")?.focus();
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("pointerdown", onClick); };
  }, [open]);

  const set = (next: A11yPrefs) => applyPrefs(next);
  const active = Object.values(current).filter(Boolean).length;

  return (
    <div className="a11y fixed bottom-5 left-5 z-[70]" data-live-skip>
      <button
        ref={btn}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="a11y-panel"
        aria-label={`Accessibility options${active ? `, ${active} on` : ""}`}
        className="a11y-btn grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-[#121212]/90 text-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.9)] backdrop-blur transition-colors hover:border-white/50"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="4.5" r="1.8" fill="currentColor" stroke="none" />
          <path d="M4 9.5c2.7.7 5.3 1 8 1s5.3-.3 8-1M12 10.5v4.5M12 15l-3 6M12 15l3 6" />
        </svg>
        {active > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand-500 px-1 font-mono text-[9px] font-bold text-white">{active}</span>}
      </button>

      <div
        id="a11y-panel"
        ref={panel}
        role="dialog"
        aria-label="Accessibility options"
        hidden={!open}
        className="a11y-panel absolute bottom-14 left-0 w-[20rem] rounded-2xl border border-white/15 bg-[#161616] p-4 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.95)]"
      >
        <div className="flex items-center justify-between gap-3">
          <p className="eyebrow text-white">Accessibility</p>
          <button type="button" onClick={() => set({ ...A11Y_DEFAULTS })} className="label rounded-md border border-white/15 px-2 py-1 text-neutral-300 hover:border-white/40 hover:text-white">Reset</button>
        </div>
        <ul className="mt-3 flex flex-col gap-1">
          {OPTIONS.map((o) => (
            <li key={o.key}>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-2 hover:bg-white/[0.04]">
                <input
                  type="checkbox"
                  checked={current[o.key]}
                  onChange={(e) => set({ ...current, [o.key]: e.target.checked })}
                  className="a11y-switch mt-0.5"
                />
                <span>
                  <span className="block text-sm font-semibold text-white">{o.label}</span>
                  <span className="block text-xs leading-5 text-neutral-400">{o.hint}</span>
                </span>
              </label>
            </li>
          ))}
        </ul>
        <p className="mt-3 border-t border-white/10 pt-3 text-[11px] leading-5 text-neutral-500">Saved on this device. Your system’s reduce-motion setting is always respected.</p>
      </div>
    </div>
  );
}
