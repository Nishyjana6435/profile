"use client";

import { useEffect, useRef } from "react";

const HOT = "a, button, [role='button'], input, textarea, select, summary, label";

/**
 * Cursor bubble: a dot on the pointer and a soft bubble that follows with lag,
 * swelling over links and buttons, and releasing little bubbles on click.
 * Fine pointers only; off for touch and reduced motion.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement | null>(null);
  const ring = useRef<HTMLDivElement | null>(null);
  const pops = useRef<HTMLDivElement | null>(null);
  const magnet = useRef<HTMLElement | null>(null);
  const ghost = useRef({ x: 0, y: 0 });
  const ghostTarget = useRef({ x: 0, y: 0 });
  const ghostRaf = useRef(0);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const d = dot.current, r = ring.current, p = pops.current;
    if (!fine || reduced || !d || !r || !p) return;

    document.documentElement.classList.add("has-cursor");
    // the ghost eases toward where the button is, always a beat behind; on leave it springs back
    const ghostLoop = () => {
      const g = ghost.current, t = ghostTarget.current;
      g.x += (t.x - g.x) * 0.1; g.y += (t.y - g.y) * 0.1;
      const live = document.querySelector<HTMLElement>(".btn.is-magnet") ?? magnet.current;
      live?.style.setProperty("--gx", `${g.x.toFixed(1)}px`);
      live?.style.setProperty("--gy", `${g.y.toFixed(1)}px`);
      const settled = Math.abs(t.x - g.x) + Math.abs(t.y - g.y) < 0.2;
      ghostRaf.current = settled ? 0 : requestAnimationFrame(ghostLoop);
    };
    let x = -100, y = -100, rx = -100, ry = -100, raf = 0, shown = false;

    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      r.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      d.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      if (!shown) {
        shown = true;
        rx = x; ry = y;
        d.classList.add("is-on");
        r.classList.add("is-on");
      }
      const hot = (e.target as Element | null)?.closest?.(HOT);
      r.classList.toggle("is-hot", Boolean(hot));
      const labelled = (e.target as Element | null)?.closest?.<HTMLElement>("[data-cursor]");
      const label = labelled?.dataset.cursor ?? "";
      if (label !== r.textContent) r.textContent = label;
      r.classList.toggle("is-label", Boolean(label));
      d.classList.toggle("is-hidden", Boolean(label));
      // magnetic buttons: .btn leans toward the pointer while hovered, and a ghost outline lags behind
      const btn = (e.target as Element | null)?.closest?.<HTMLElement>(".btn");
      if (btn !== magnet.current) {
        const prev = magnet.current;
        if (prev) { prev.style.setProperty("--mx", "0px"); prev.style.setProperty("--my", "0px"); prev.classList.remove("is-magnet"); ghostTarget.current = { x: 0, y: 0 }; }
        magnet.current = btn ?? null;
        if (btn) { btn.classList.add("is-magnet"); ghost.current = { x: 0, y: 0 }; }
      }
      if (btn) {
        const b = btn.getBoundingClientRect();
        const mx = (x - (b.left + b.width / 2)) * 0.22, my = (y - (b.top + b.height / 2)) * 0.3;
        btn.style.setProperty("--mx", `${mx.toFixed(1)}px`);
        btn.style.setProperty("--my", `${my.toFixed(1)}px`);
        ghostTarget.current = { x: mx, y: my };
        if (!ghostRaf.current) ghostRaf.current = requestAnimationFrame(ghostLoop);
      }
    };
    const onLeave = () => {
      d.classList.remove("is-on");
      r.classList.remove("is-on");
      shown = false;
    };
    const onDown = () => {
      r.classList.add("is-down");
      // shockwave ring
      const wave = document.createElement("span");
      wave.className = "cur-wave";
      wave.style.setProperty("--x", `${x}px`);
      wave.style.setProperty("--y", `${y}px`);
      p.appendChild(wave);
      wave.addEventListener("animationend", () => wave.remove(), { once: true });
      // burst of red and glass bubbles
      const count = 16;
      for (let i = 0; i < count; i++) {
        const b = document.createElement("span");
        const red = i % 3 === 0;
        b.className = `cur-bubble ${red ? "cur-bubble--red" : "cur-bubble--glass"}`;
        const a = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
        const dist = 46 + Math.random() * 70;
        b.style.setProperty("--x", `${x}px`);
        b.style.setProperty("--y", `${y}px`);
        b.style.setProperty("--dx", `${Math.cos(a) * dist}px`);
        b.style.setProperty("--dy", `${Math.sin(a) * dist - 24}px`);
        b.style.setProperty("--s", `${red ? 6 + Math.random() * 10 : 8 + Math.random() * 16}px`);
        b.style.setProperty("--t", `${0.7 + Math.random() * 0.5}s`);
        p.appendChild(b);
        b.addEventListener("animationend", () => b.remove(), { once: true });
      }
    };
    const onUp = () => r.classList.remove("is-down");

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <>
      <div ref={ring} aria-hidden="true" className="cur-ring" />
      <div ref={dot} aria-hidden="true" className="cur-dot" />
      <div ref={pops} aria-hidden="true" className="cur-pops" />
    </>
  );
}
