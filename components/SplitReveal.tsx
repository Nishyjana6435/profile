"use client";

import { useEffect, useRef, type CSSProperties } from "react";

export type Seg = { text: string; className?: string };

/** Headline words rise out of a mask, one after another, when the heading scrolls into view. */
export default function SplitReveal({ segs, as = "h2", className = "" }: { segs: Seg[]; as?: "h1" | "h2" | "h3" | "p"; className?: string }) {
  const ref = useRef<HTMLElement | null>(null);
  const Tag = as as "h2";
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let t = 0;
    const io = new IntersectionObserver((es) => {
      if (!es.some((e) => e.isIntersecting)) return;
      el.classList.add("is-on");
      io.disconnect();
      // after the entrance, hand the words to the pointer-reactive layer
      t = window.setTimeout(() => {
        el.classList.add("is-live");
        el.setAttribute("data-live", "");
        el.querySelectorAll<HTMLElement>(".sr-word > span").forEach((w) => w.classList.add("lw"));
      }, 1600);
    }, { threshold: 0.3 });
    io.observe(el);
    return () => { io.disconnect(); clearTimeout(t); };
  }, []);
  let i = 0;
  return (
    <Tag ref={ref as never} className={`sr ${className}`}>
      {segs.map((s, si) =>
        s.text.split(" ").filter(Boolean).map((w, wi) => (
          <span key={`${si}-${wi}`} className="sr-word">
            <span className={s.className} style={{ "--i": i++ } as CSSProperties}>{w}</span>{" "}
          </span>
        )),
      )}
    </Tag>
  );
}
