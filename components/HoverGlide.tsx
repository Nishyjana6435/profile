"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** A single highlight that glides between the list rows under the pointer. */
export default function HoverGlide({ children, className = "" }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement | null>(null);
  const bar = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = root.current, b = bar.current;
    if (!el || !b) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    let y = 0, h = 0, on = false, raf = 0;
    let row: HTMLElement | null = null;
    // re-measure the hovered row every frame so the bar follows it while it expands
    const loop = () => {
      if (!row) { raf = 0; return; }
      const r = row.getBoundingClientRect(), rr = el.getBoundingClientRect();
      const ty = r.top - rr.top, th = r.height;
      y += (ty - y) * 0.16; h += (th - h) * 0.16;
      b.style.transform = `translateY(${y.toFixed(1)}px)`;
      b.style.height = `${h.toFixed(1)}px`;
      raf = on || Math.abs(ty - y) + Math.abs(th - h) > 0.3 ? requestAnimationFrame(loop) : 0;
    };
    const onOver = (e: Event) => {
      const next = (e.target as Element).closest("li");
      if (!next || !el.contains(next)) return;
      row = next as HTMLElement;
      if (!on) {
        on = true;
        const r = row.getBoundingClientRect(), rr = el.getBoundingClientRect();
        y = r.top - rr.top; h = r.height; b.style.opacity = "1";
      }
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onLeave = () => { on = false; b.style.opacity = "0"; };
    el.addEventListener("mouseover", onOver);
    el.addEventListener("mouseleave", onLeave);
    return () => { el.removeEventListener("mouseover", onOver); el.removeEventListener("mouseleave", onLeave); if (raf) cancelAnimationFrame(raf); };
  }, []);
  return (
    <div ref={root} className={`relative ${className}`}>
      <div ref={bar} aria-hidden="true" className="glide pointer-events-none absolute inset-x-0 top-0 z-0 opacity-0" />
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
