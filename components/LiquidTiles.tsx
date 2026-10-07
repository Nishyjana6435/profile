"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * The hero's three answer tiles as a tank. Drops fall from the name above and
 * the tank fills with white liquid; text turns black as it goes under. When it
 * is full a block in the right wall slides out, the liquid drains through the
 * gap, the block slides back and the fill starts again.
 */
const FILL = 16, HOLD = 1.1, OPEN = 0.7, DRAIN = 2.6, CLOSE = 0.7, REST = 0.8;
const TOTAL = FILL + HOLD + OPEN + DRAIN + CLOSE + REST;

export default function LiquidTiles({ children, source = ".hero-name" }: { children: ReactNode; source?: string }) {
  const root = useRef<HTMLDivElement | null>(null);
  const drops = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = root.current, dl = drops.current;
    if (!el || !dl) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0, visible = false;
    const t0 = performance.now();
    const src = document.querySelector<HTMLElement>(source);

    // the drop layer spans from the name's baseline down to the tank's top, full width
    const place = () => {
      if (!src) return;
      const a = src.getBoundingClientRect(), b = el.getBoundingClientRect();
      const dy = Math.max(0, b.top - a.bottom);
      dl.style.top = `${-dy}px`; dl.style.height = `${dy}px`;
      dl.style.left = "0"; dl.style.width = "100%";
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(el); if (src) ro.observe(src);

    const io = new IntersectionObserver((es) => { visible = es.some((e) => e.isIntersecting); if (visible && !raf) raf = requestAnimationFrame(tick); }, { threshold: 0.05 });
    io.observe(el);

    // a drip that has left the name keeps falling into the tank, same size, same column
    let phase = "fill";
    const onDrip = (e: Event) => {
      if (phase !== "fill") return;
      const { x, top, w, h } = (e as CustomEvent<{ x: number; top: number; w: number; h: number }>).detail;
      const lr = dl.getBoundingClientRect();
      const d = document.createElement("span");
      d.className = "lq-drop";
      d.style.left = `${x - lr.left - w / 2}px`;
      d.style.top = `${top - lr.top}px`;
      d.style.width = `${w}px`; d.style.height = `${h}px`;
      const fall = Math.max(0, lr.bottom - top - h);
      d.style.setProperty("--fall", `${fall}px`);
      d.style.setProperty("--dur", `${Math.max(0.45, Math.sqrt(fall / 900) * 0.9).toFixed(2)}s`);
      dl.appendChild(d);
      d.addEventListener("animationend", () => d.remove(), { once: true });
    };
    window.addEventListener("nishy:drip", onDrip);

    const tick = (now: number) => {
      if (!visible) { raf = 0; return; }
      const t = ((now - t0) / 1000) % TOTAL;
      let level = 0, gate = 0, drain = 0;
      if (t < FILL) { level = t / FILL; phase = "fill"; }
      else if (t < FILL + HOLD) { level = 1; phase = "hold"; }
      else if (t < FILL + HOLD + OPEN) { level = 1; gate = (t - FILL - HOLD) / OPEN; phase = "open"; }
      else if (t < FILL + HOLD + OPEN + DRAIN) { const p = (t - FILL - HOLD - OPEN) / DRAIN; level = 1 - (1 - Math.pow(1 - p, 2)); gate = 1; drain = 1; phase = "drain"; }
      else if (t < FILL + HOLD + OPEN + DRAIN + CLOSE) { level = 0; gate = 1 - (t - FILL - HOLD - OPEN - DRAIN) / CLOSE; phase = "close"; }
      else { level = 0; gate = 0; phase = "rest"; }
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
      {/* flooded copy: white liquid with the same content in black, clipped to the level */}
      <div aria-hidden="true" className="lq-flood pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
        <div className="lq-liquid absolute inset-x-0">
          <svg className="lq-wave absolute inset-x-0 bottom-full h-3 w-[200%]" viewBox="0 0 1200 12" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 12 C 50 2, 100 2, 150 12 S 250 22, 300 12 S 400 2, 450 12 S 550 22, 600 12 S 700 2, 750 12 S 850 22, 900 12 S 1000 2, 1050 12 S 1150 22, 1200 12 V 12 H 0 Z" fill="#fff" />
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
