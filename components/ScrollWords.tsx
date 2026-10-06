"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Words light up from grey to white as the block scrolls through the viewport,
 * the way the reference site reads its statements. Pure DOM, one rAF.
 */
export default function ScrollWords({
  text,
  as = "p",
  className = "",
  accent,
}: {
  text: string;
  as?: "p" | "h2" | "h3";
  className?: string;
  /** Words (lower-case) that stay highlighted once lit. */
  accent?: string[];
}) {
  const ref = useRef<HTMLElement | null>(null);
  const words = text.split(/\s+/).filter(Boolean);
  const Tag = as as "p";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const spans = Array.from(el.querySelectorAll<HTMLSpanElement>(".sw-word"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      spans.forEach((s) => s.classList.add("is-on"));
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const start = vh * 0.9;
      const end = vh * 0.35;
      const p = Math.min(1, Math.max(0, (start - r.top) / Math.max(1, r.height + start - end)));
      const lit = Math.round(p * spans.length);
      spans.forEach((s, i) => s.classList.toggle("is-on", i < lit));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [text]);

  const out: ReactNode[] = [];
  words.forEach((w, i) => {
    const hot = accent?.includes(w.toLowerCase().replace(/[^a-z0-9+]/g, ""));
    out.push(
      <span key={i} className={`sw-word ${hot ? "text-brand-400" : ""}`}>
        {w}
      </span>,
      " ",
    );
  });

  return (
    <Tag ref={ref as never} className={className}>
      {out}
    </Tag>
  );
}
