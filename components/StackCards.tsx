"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

const ease = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Case-study cards stick near the top while the next one scrolls over them.
 * The covered card scales down, drifts up and fades: it "moves away".
 * Each card's progress eases toward its scroll target in a continuous rAF loop,
 * so the motion stays smooth even on fast or stepped scrolling.
 */
export default function StackCards({ children, top = 96 }: { children: ReactNode[]; top?: number }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cards = Array.from(root.querySelectorAll<HTMLElement>(".sc-card"));
    const target = new Array<number>(cards.length).fill(0);
    const current = new Array<number>(cards.length).fill(0);
    let raf = 0;
    let dirty = true;
    let idle = 0;

    const measure = () => {
      for (let i = 0; i < cards.length; i++) {
        const next = cards[i + 1];
        let p = 0;
        if (next) {
          const r = cards[i].getBoundingClientRect();
          const n = next.getBoundingClientRect();
          p = Math.min(1, Math.max(0, (r.bottom - n.top) / Math.max(1, r.height)));
        }
        target[i] = ease(p);
      }
    };
    const frame = () => {
      if (dirty) {
        measure();
        dirty = false;
      }
      let moving = false;
      for (let i = 0; i < cards.length; i++) {
        const d = target[i] - current[i];
        if (Math.abs(d) > 0.0005) {
          current[i] += d * 0.14;
          moving = true;
        } else {
          current[i] = target[i];
        }
        cards[i].style.setProperty("--p", current[i].toFixed(4));
      }
      // keep ticking briefly after motion stops, then sleep until the next scroll
      idle = moving ? 0 : idle + 1;
      raf = idle < 10 ? requestAnimationFrame(frame) : 0;
    };
    const wake = () => {
      dirty = true;
      idle = 0;
      if (!raf) raf = requestAnimationFrame(frame);
    };
    wake();
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake);
    return () => {
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", wake);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [children.length]);

  return (
    <div ref={ref} className="sc-stack">
      {children.map((child, i) => (
        <div key={i} className="sc-card" style={{ "--top": `${top + i * 10}px`, "--i": i } as CSSProperties}>
          {child}
        </div>
      ))}
    </div>
  );
}
