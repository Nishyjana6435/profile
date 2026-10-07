"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type PointerEvent } from "react";

/**
 * Display text rendered as a liquid surface: a gooey filter lets drops bead off
 * the baseline and fall, and a turbulence displacement makes the whole word
 * wobble when the pointer dips into it, settling back like disturbed water.
 */
export default function WaterText({ text, className = "" }: { text: string; className?: string }) {
  const id = useId().replace(/:/g, "");
  const wrap = useRef<HTMLSpanElement | null>(null);
  const disp = useRef<SVGFEDisplacementMapElement | null>(null);
  const turb = useRef<SVGFETurbulenceElement | null>(null);
  const state = useRef<{ amp: number; t: number; raf: number; last: number; reduced: boolean; io?: IntersectionObserver }>({ amp: 0, t: 0, raf: 0, last: 0, reduced: false });
  const [live, setLive] = useState(false); // noise animates only on fine pointers while in view
  const IDLE = 2.5;

  useEffect(() => {
    const s = state.current;
    s.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    disp.current?.setAttribute("scale", s.reduced ? "0" : String(IDLE));
    // when a drip reaches the end of its fall, tell the page where it landed so it can carry on falling
    const el = wrap.current;
    if (el && window.matchMedia("(pointer: fine)").matches && !s.reduced) {
      const io = new IntersectionObserver((es) => setLive(es.some((e) => e.isIntersecting)), { threshold: 0.05 });
      io.observe(el);
      s.io = io;
    }
    // the cycle restarts the moment the neck pinches off, so the free drop starts where the
    // stretched bead's tip was: 0.46em down plus a 0.12em bead stretched 2.4x (see @keyframes wt-drip)
    const TIP = 0.46 + 0.12 * 2.4;
    // offsetTop/offsetLeft are layout positions and ignore the transform, so they are the same
    // whether the event is handled before or after the style has snapped back to the bead
    const onIter = (e: Event) => {
      const d = e.target as HTMLElement;
      if (!d.classList.contains("wt-drop")) return;
      const host = d.offsetParent?.getBoundingClientRect();
      if (!host) return;
      const fs = parseFloat(getComputedStyle(d).fontSize);
      const w = d.offsetWidth;
      window.dispatchEvent(new CustomEvent("nishy:drip", { detail: { x: host.left + d.offsetLeft, tip: host.top + d.offsetTop + fs * TIP, w, h: fs * 0.12 } }));
    };
    el?.addEventListener("animationiteration", onIter);
    // once the entrance reveal has played, let drips fall past the mask
    const mask = el?.closest<HTMLElement>(".hero-mask");
    const release = window.setTimeout(() => { if (mask) mask.style.overflow = "visible"; }, 1400);
    return () => { cancelAnimationFrame(s.raf); el?.removeEventListener("animationiteration", onIter); clearTimeout(release); s.io?.disconnect(); };
  }, []);

  const loop = (now: number) => {
    const s = state.current;
    const dt = Math.min(0.05, (now - s.last) / 1000);
    s.last = now;
    s.t += dt;
    // damped oscillation: a hit sets amplitude, it rings and decays like a surface settling
    s.amp *= Math.exp(-2.2 * dt);
    const scale = IDLE + s.amp * Math.sin(s.t * 14);
    disp.current?.setAttribute("scale", scale.toFixed(2));
    if (s.amp > 0.3) s.raf = requestAnimationFrame(loop);
    else {
      disp.current?.setAttribute("scale", String(IDLE));
      s.raf = 0;
    }
  };

  const splash = (e: PointerEvent<HTMLSpanElement>) => {
    const s = state.current;
    if (s.reduced) return;
    // a fresh dip reseeds the noise so each ripple looks different
    turb.current?.setAttribute("seed", String(Math.floor(Math.random() * 100)));
    s.amp = Math.min(48, s.amp + 30);
    if (!s.raf) {
      s.last = performance.now();
      s.raf = requestAnimationFrame(loop);
    }
    // ripple ring at the pointer
    const el = wrap.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const ring = document.createElement("span");
    ring.className = "wt-ring";
    ring.style.left = `${e.clientX - r.left}px`;
    ring.style.top = `${e.clientY - r.top}px`;
    el.appendChild(ring);
    ring.addEventListener("animationend", () => ring.remove(), { once: true });
  };

  // keep the surface disturbed while the pointer is moving inside it
  const stir = (e: PointerEvent<HTMLSpanElement>) => {
    const s = state.current;
    if (s.reduced) return;
    if (s.amp < 12) { s.amp = 12; if (!s.raf) { s.last = performance.now(); s.raf = requestAnimationFrame(loop); } }
    if (Math.random() < 0.05) splash(e);
  };

  const drops = [
    // drips sit under S, H and the start of Y: the column that is clear of the statement and the portrait
    { x: 49, d: 0, dur: 7 }, { x: 57, d: 2.4, dur: 8.5 }, { x: 65, d: 4.1, dur: 6.5 }, { x: 74, d: 1.3, dur: 9 }, { x: 82, d: 5.6, dur: 7.5 },
  ];

  return (
    <span ref={wrap} className={`wt relative inline-block ${className}`} onPointerEnter={splash} onPointerMove={stir}>
      <svg aria-hidden="true" width="0" height="0" className="absolute">
        <filter id={`wt-${id}`} x="-10%" y="-20%" width="120%" height="300%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10" result="goo" />
          <feTurbulence ref={turb} type="fractalNoise" baseFrequency="0.012 0.028" numOctaves="2" seed="3" result="noise">
            {live && <animate attributeName="baseFrequency" values="0.012 0.028;0.016 0.022;0.012 0.028" dur="9s" repeatCount="indefinite" />}
          </feTurbulence>
          <feDisplacementMap ref={disp} in="goo" in2="noise" scale="2.5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <span className="wt-surface inline-block" style={{ filter: `url(#wt-${id})` } as CSSProperties}>
        <span className="wt-text inline-block">{text}</span>
        {drops.map((d, i) => (
          <span key={i} aria-hidden="true" className="wt-drop" style={{ "--x": `${d.x}%`, "--d": `${d.d}s`, "--dur": `${d.dur}s` } as CSSProperties} />
        ))}
      </span>
    </span>
  );
}
