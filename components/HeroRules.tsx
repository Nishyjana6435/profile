"use client";

import { useEffect, useRef } from "react";

/**
 * The hero's drafting grid draws itself on the first visit of the session:
 * vertical rules sweep down, then the content lands on them. Later visits in
 * the same session skip the draw so returning feels instant.
 */
export default function HeroRules() {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    const section = el?.parentElement;
    if (!el || !section) return;
    let seen = false;
    try { seen = sessionStorage.getItem("hero-drawn") === "1"; sessionStorage.setItem("hero-drawn", "1"); } catch {}
    if (seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) section.classList.add("hero-instant");
    section.classList.add("hero-ready");
  }, []);
  return <div ref={ref} aria-hidden="true" className="hero-rules pointer-events-none absolute inset-0" />;
}
