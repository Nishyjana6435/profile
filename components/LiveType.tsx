"use client";

import { useEffect, useRef } from "react";

/** Giant display text whose letters lift and lean toward the pointer, with lag. */
export default function LiveType({ text, className = "", reach = 180, lift = 18 }: { text: string; className?: string; reach?: number; lift?: number }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const letters = Array.from(el.querySelectorAll<HTMLSpanElement>(".lt"));
    const cur = letters.map(() => ({ y: 0, r: 0 }));
    let px = -9999, py = -9999, raf = 0;
    const loop = () => {
      let moving = false;
      letters.forEach((l, i) => {
        const b = l.getBoundingClientRect();
        const cx = b.left + b.width / 2, cy = b.top + b.height / 2;
        const d = Math.hypot(px - cx, py - cy);
        const k = Math.max(0, 1 - d / reach);
        const ty = -lift * k * k, tr = ((px - cx) / reach) * 6 * k;
        const c = cur[i];
        c.y += (ty - c.y) * 0.12; c.r += (tr - c.r) * 0.12;
        if (Math.abs(ty - c.y) > 0.05 || Math.abs(tr - c.r) > 0.05) moving = true;
        l.style.transform = `translateY(${c.y.toFixed(2)}px) rotate(${c.r.toFixed(2)}deg)`;
      });
      raf = moving ? requestAnimationFrame(loop) : 0;
    };
    const onMove = (e: PointerEvent) => { px = e.clientX; py = e.clientY; if (!raf) raf = requestAnimationFrame(loop); };
    const onLeave = () => { px = -9999; py = -9999; if (!raf) raf = requestAnimationFrame(loop); };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => { window.removeEventListener("pointermove", onMove); document.documentElement.removeEventListener("mouseleave", onLeave); if (raf) cancelAnimationFrame(raf); };
  }, [reach, lift]);
  return (
    <span ref={ref} className={className} aria-label={text}>
      {Array.from(text).map((ch, i) => (
        <span key={i} className="lt inline-block will-change-transform" aria-hidden="true">
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}
