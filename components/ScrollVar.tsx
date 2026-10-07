"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Writes a 0..1 scroll progress to --p on its element.
 * mode "center": progress as the element's centre travels from `from` to `to` (fractions of viewport height).
 * mode "end": progress as the viewport bottom moves through the element (0 at its top, 1 at its bottom).
 */
export default function ScrollVar({ children, className = "", from = 0.6, to = 0.1, mode = "center" }: { children: ReactNode; className?: string; from?: number; to?: number; mode?: "center" | "end" }) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      let p: number;
      if (mode === "end") p = (vh - r.top) / Math.max(1, r.height);
      else { const c = (r.top + r.height / 2) / vh; p = (from - c) / (from - to); }
      el.style.setProperty("--p", Math.min(1, Math.max(0, p)).toFixed(4));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [from, to, mode]);
  return <div ref={ref} className={className} style={{ "--p": 0 } as React.CSSProperties}>{children}</div>;
}
