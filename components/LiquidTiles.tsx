"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * The hero's three answer tiles as a tank. Drops fall from the name above and
 * the tank fills with accent-coloured liquid; text turns black as it goes under. When it
 * is full a block in the right wall slides out, the liquid drains through the
 * gap, the block slides back and the fill starts again.
 */
const FILL = 16, HOLD = 1.1, OPEN = 0.7, DRAIN = 2.6, CLOSE = 0.7, REST = 0.8;
const TOTAL = FILL + HOLD + OPEN + DRAIN + CLOSE + REST;
const WARMUP = 1.6; // the loop waits for the hero entrance
const STRETCH = 1.25, G = 1500; // starting scaleY of .lq-drop, and gravity in px/s²

type Phase = "fill" | "hold" | "open" | "drain" | "close" | "rest";

/** Liquid level, gate opening and phase at a point in the cycle. */
function stateAt(t: number): { level: number; gate: number; drain: number; phase: Phase } {
  t = ((t % TOTAL) + TOTAL) % TOTAL;
  if (t < FILL) return { level: t / FILL, gate: 0, drain: 0, phase: "fill" };
  t -= FILL;
  if (t < HOLD) return { level: 1, gate: 0, drain: 0, phase: "hold" };
  t -= HOLD;
  if (t < OPEN) return { level: 1, gate: t / OPEN, drain: 0, phase: "open" };
  t -= OPEN;
  if (t < DRAIN) { const p = t / DRAIN; return { level: (1 - p) * (1 - p), gate: 1, drain: 1, phase: "drain" }; }
  t -= DRAIN;
  if (t < CLOSE) return { level: 0, gate: 1 - t / CLOSE, drain: 0, phase: "close" };
  return { level: 0, gate: 0, drain: 0, phase: "rest" };
}

export default function LiquidTiles({ children, source = ".hero-name" }: { children: ReactNode; source?: string }) {
  const root = useRef<HTMLDivElement | null>(null);
  const drops = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = root.current, dl = drops.current;
    if (!el || !dl) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0, visible = false;
    const t0 = performance.now();
    const cycleTime = (now: number) => Math.max(0, (now - t0) / 1000 - WARMUP);
    const src = document.querySelector<HTMLElement>(source);

    // the drop layer spans from the name's baseline down to the tank's floor, full width
    const place = () => {
      if (!src) return;
      const a = src.getBoundingClientRect(), b = el.getBoundingClientRect();
      const dy = Math.max(0, b.top - a.bottom);
      dl.style.top = `${-dy}px`; dl.style.height = `${dy + b.height}px`;
      dl.style.left = "0"; dl.style.width = "100%";
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(el); if (src) ro.observe(src);

    const io = new IntersectionObserver((es) => { visible = es.some((e) => e.isIntersecting); if (visible && !raf) raf = requestAnimationFrame(tick); }, { threshold: 0.05 });
    io.observe(el);

    const spawn = (cls: string, x: number, y: number, w: number, h: number, vars?: Record<string, string>) => {
      const s = document.createElement("span");
      s.className = cls;
      s.style.left = `${x}px`; s.style.top = `${y}px`;
      s.style.width = `${w}px`; s.style.height = `${h}px`;
      if (vars) for (const k in vars) s.style.setProperty(k, vars[k]);
      dl.appendChild(s);
      s.addEventListener("animationend", () => s.remove(), { once: true });
      return s;
    };

    // the drop meets the surface: two ripple rings spreading out and a small crown of droplets thrown up
    const splash = (x: number, y: number, w: number) => {
      spawn("lq-ring", x, y, w * 3.4, w * 1.1);
      spawn("lq-ring lq-ring--late", x, y, w * 2.2, w * 0.8);
      for (let i = -1; i <= 1; i++) {
        const dx = i * w * (1.2 + Math.random() * 0.8), dy = w * (1.8 + Math.random() * 1.4), r = w * (0.14 + Math.random() * 0.1);
        spawn("lq-bead", x - r, y - r, r * 2, r * 2, { "--dx": `${dx.toFixed(1)}px`, "--dy": `${dy.toFixed(1)}px`, "--spin": `${(i * 18).toFixed(0)}deg` });
      }
    };

    // a drop that has pinched off the name keeps falling into the tank: same column, tip where the
    // neck broke, one gravity curve down to where the liquid surface will be when it lands
    const onDrip = (e: Event) => {
      if (!dl.offsetParent) return; // the drop layer is hidden on this layout
      const { x, tip, w, h } = (e as CustomEvent<{ x: number; tip: number; w: number; h: number }>).detail;
      const lr = dl.getBoundingClientRect(), tr = el.getBoundingClientRect();
      // iterate once: the fall time depends on the surface height, which moves while the drop falls
      let fall = Math.max(0, tr.bottom - tip), dur = 0;
      for (let i = 0; i < 2; i++) {
        dur = Math.max(0.35, Math.sqrt((2 * fall) / G));
        const { level } = stateAt(cycleTime(performance.now()) + dur);
        const surface = tr.bottom - level * tr.height - (level > 0 ? 6 : 0); // the wave crest sits a little above the fill line
        fall = Math.max(0, surface - tip);
      }
      if (fall <= 0) return;
      const d = spawn("lq-drop", x - lr.left - w / 2, tip - h * STRETCH - lr.top, w, h, { "--fall": `${fall}px`, "--dur": `${dur.toFixed(2)}s` });
      d.addEventListener("animationend", () => splash(x - lr.left, tip + fall - lr.top, w), { once: true });
    };
    window.addEventListener("nishy:drip", onDrip);

    let frame = 0;
    const tick = (now: number) => {
      if (!visible) { raf = 0; return; }
      // every other frame is plenty for a liquid level, and the loop waits for the hero entrance
      if (now - t0 < WARMUP * 1000 || frame++ % 2) { raf = requestAnimationFrame(tick); return; }
      const { level, gate, drain, phase } = stateAt(cycleTime(now));
      el.style.setProperty("--level", level.toFixed(4));
      el.style.setProperty("--gate", gate.toFixed(3));
      el.style.setProperty("--drain", String(drain));
      el.dataset.phase = phase;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); window.removeEventListener("nishy:drip", onDrip); };
  }, [source]);

  return (
    <div ref={root} className="lq relative" style={{ "--level": 0, "--gate": 0, "--drain": 0 } as CSSProperties}>
      <div ref={drops} aria-hidden="true" className="lq-drops pointer-events-none absolute z-20" />
      {/* dry layer */}
      <div className="lq-dry">{children}</div>
      {/* flooded copy: accent liquid with the same content in black, clipped to the level */}
      <div aria-hidden="true" className="lq-flood pointer-events-none absolute inset-0 overflow-clip rounded-2xl">
        <div className="lq-liquid absolute inset-x-0">
          <svg className="lq-wave absolute inset-x-0 bottom-full h-3 w-[200%]" viewBox="0 0 1200 12" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 12 C 50 2, 100 2, 150 12 S 250 22, 300 12 S 400 2, 450 12 S 550 22, 600 12 S 700 2, 750 12 S 850 22, 900 12 S 1000 2, 1050 12 S 1150 22, 1200 12 V 12 H 0 Z" style={{ fill: "var(--accent)" }} />
          </svg>
        </div>
        <div className="lq-ink absolute inset-0">{children}</div>
        <span className="lq-spout absolute" />
      </div>
      {/* the removable block in the right wall */}
      <span aria-hidden="true" className="lq-gap absolute" />
      <span aria-hidden="true" className="lq-block absolute" />
      <span aria-hidden="true" className="lq-stream absolute" />
    </div>
  );
}
