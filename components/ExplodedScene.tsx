"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import { pad } from "@/lib/text";

export type Plate = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Tailwind position classes inside the stage. */
  pos: string;
  /** Depth in px and the entrance delay in seconds. */
  z: number;
  delay: number;
  /** Where the leader line lands, in stage percent. */
  anchor: [number, number];
};

export type Callout = { title: string; sub: string };

/**
 * Exploded view of a product: three square plates fanned apart in 3D on the
 * drafting grid, a numbered callout rail with leader lines, hover to lift a
 * plate, pointer tilt, and a scroll-in explode.
 */
export default function ExplodedScene({
  host,
  logo,
  plates,
  callouts,
  status,
}: {
  host: string;
  logo: ReactNode;
  plates: Plate[];
  callouts: Callout[];
  status: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.classList.add("is-in"); return; }
    // the scene triggers its own entrance, so it works outside a Reveal too
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { el.classList.add("is-in"); io.disconnect(); } }, { threshold: 0.25 });
    io.observe(el);
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const p = Math.max(-1, Math.min(1, (r.top + r.height / 2 - vh / 2) / (vh / 2)));
      el.style.setProperty("--sy", `${(p * 7).toFixed(2)}deg`);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { io.disconnect(); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${(-y * 10).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(x * 14).toFixed(2)}deg`);
    el.style.setProperty("--dx", `${(x * 18).toFixed(1)}px`);
    el.style.setProperty("--dy", `${(y * 18).toFixed(1)}px`);
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    for (const v of ["--rx", "--ry"]) el.style.setProperty(v, "0deg");
    for (const v of ["--dx", "--dy"]) el.style.setProperty(v, "0px");
    setActive(null);
  };

  // leader lines run from the rail (x ≈ 22%) to each plate's anchor
  const railY = (i: number) => 16 + i * 20;

  return (
    <div ref={ref} className="ex-scene relative aspect-[4/3] w-full sm:aspect-[5/4]" onMouseMove={onMove} onMouseLeave={onLeave}>
      <div aria-hidden="true" className="rules absolute inset-0 rounded-2xl border hairline opacity-80" />
      {/* dimension marks */}
      <span aria-hidden="true" className="label absolute left-3 top-3 text-neutral-500">{host}</span>
      <span aria-hidden="true" className="label absolute bottom-3 right-3 text-neutral-500">Exploded view · 1:1</span>

      {/* callout rail */}
      <ol className="absolute left-3 top-[12%] z-30 w-[24%] sm:left-4">
        {callouts.map((c, i) => (
          <li
            key={c.title}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            className={`ex-callout border-t hairline py-3 transition-colors duration-300 ${active === i ? "text-white" : "text-neutral-400"}`}
            style={{ "--i": i } as CSSProperties}
          >
            <span className="label text-brand-400">({pad(i + 1)})</span>
            <span className="mt-1 block text-[12px] font-semibold leading-tight text-white sm:text-sm">{c.title}</span>
            <span className="label mt-1 hidden text-neutral-500 sm:block">{c.sub}</span>
          </li>
        ))}
      </ol>

      {/* leader lines */}
      <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" className="ex-leaders pointer-events-none absolute inset-0 z-20 h-full w-full overflow-visible">
        {plates.map((p, i) => {
          const y0 = railY(i) + 4;
          const [ax, ay] = p.anchor;
          const d = `M 26 ${y0} L ${Math.min(ax, 26 + (ax - 26) * 0.45)} ${y0} L ${ax} ${ay}`;
          return (
            <g key={i} className={active === null || active === i ? "is-on" : "is-dim"}>
              <path d={d} vectorEffect="non-scaling-stroke" />
              <circle cx={ax} cy={ay} r="0.9" className="ex-dot" />
              <circle r="0.7" className="ex-pulse">
                <animateMotion dur={`${2.6 + i * 0.5}s`} begin={`${i * 0.7}s`} repeatCount="indefinite" path={d} />
              </circle>
            </g>
          );
        })}
      </svg>

      {/* 3D stack */}
      <div className="ex-stage absolute inset-0">
        <div className="ex-sway absolute inset-0">
          <div aria-hidden="true" className="ex-glow absolute inset-[14%] bg-gradient-to-br from-white/10 via-white/[0.03] to-transparent blur-3xl" />
          {plates.map((p, i) => (
            <div
              key={p.src}
              className={`ex-plate absolute overflow-clip rounded-lg border bg-[#0b0b0c] ${p.pos} ${
                active === null ? "border-white/20" : active === i ? "is-active border-brand-400" : "is-dim border-white/10"
              }`}
              style={{ "--z": `${p.z}px`, "--d": `${p.delay}s`, "--m": 1 + i * 0.35 } as CSSProperties}
            >
              <div className="flex h-6 items-center justify-between border-b border-white/10 bg-[#121212] px-2">
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/45">Plate {pad(i + 1)}</span>
                <span className="font-mono text-[9px] text-white/30">{p.width}×{p.height}</span>
              </div>
              <Image src={p.src} alt={p.alt} width={p.width} height={p.height} sizes="(min-width: 1024px) 34vw, 60vw" className="h-auto w-full" />
            </div>
          ))}

          {/* logo + status chip */}
          <div className="ex-plate absolute right-[3%] top-[12%] flex items-center gap-2 rounded-lg border border-white/15 bg-[#121212] px-2.5 py-2" style={{ "--z": "200px", "--d": "1.1s", "--m": 2 } as CSSProperties}>
            <span className="[&>svg]:h-7 [&>svg]:w-7">{logo}</span>
            <span className="leading-tight">
              <span className="block font-mono text-[9px] uppercase tracking-[0.16em] text-white/45">Status</span>
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> {status}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
