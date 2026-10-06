"use client";

import { useEffect, useRef } from "react";

/** Pointer-following spotlight that brightens the drafting grid around the cursor. */
export default function Spotlight() {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const parent = el.parentElement!;
    let tx = -999, ty = -999, x = tx, y = ty, raf = 0;
    const loop = () => {
      x += (tx - x) * 0.1; y += (ty - y) * 0.1;
      el.style.setProperty("--mx", `${x.toFixed(1)}px`); el.style.setProperty("--my", `${y.toFixed(1)}px`);
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.3 ? requestAnimationFrame(loop) : 0;
    };
    const onMove = (e: PointerEvent) => {
      const r = parent.getBoundingClientRect();
      tx = e.clientX - r.left; ty = e.clientY - r.top;
      el.style.opacity = "1";
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onLeave = () => { el.style.opacity = "0"; };
    parent.addEventListener("pointermove", onMove, { passive: true });
    parent.addEventListener("pointerleave", onLeave);
    return () => { parent.removeEventListener("pointermove", onMove); parent.removeEventListener("pointerleave", onLeave); if (raf) cancelAnimationFrame(raf); };
  }, []);
  return <div ref={ref} aria-hidden="true" className="spot pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500" />;
}
