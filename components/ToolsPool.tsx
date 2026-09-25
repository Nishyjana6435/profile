"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { TOOLS, TOOL_CATEGORIES, TOOL_USE_LINKS, type ToolCategory } from "@/lib/tools";
import Reveal from "./Reveal";

const STEP = 360 / TOOLS.length;
const IDLE_SPEED = 0.07; // degrees per frame

function shortest(delta: number) {
  return ((((delta + 180) % 360) + 360) % 360) - 180;
}

export default function ToolsPool() {
  const [selected, setSelected] = useState(0);
  const [category, setCategory] = useState<ToolCategory | "All">("All");

  const ringRef = useRef<HTMLDivElement | null>(null);
  const tileRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const angle = useRef(0);
  const target = useRef<number | null>(-0);
  const paused = useRef(false);
  const dimmed = useRef<Set<string>>(new Set());
  const reduced = useRef(false);

  const tool = TOOLS[selected];

  // Category filter dims tiles outside the group and jumps to the first one inside it.
  useEffect(() => {
    dimmed.current =
      category === "All" ? new Set() : new Set(TOOLS.filter((t) => t.category !== category).map((t) => t.id));
  }, [category]);

  const select = (i: number) => {
    setSelected(i);
    target.current = -i * STEP;
    paused.current = true;
  };

  const pick = (c: ToolCategory | "All") => {
    setCategory(c);
    if (c !== "All" && TOOLS[selected].category !== c) {
      const i = TOOLS.findIndex((t) => t.category === c);
      if (i >= 0) select(i);
    }
  };

  // One rAF loop drives the ring: idle spin, eased travel to the selected tile, and per-tile depth fade.
  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let resume = 0;
    const tick = () => {
      const ring = ringRef.current;
      if (!ring) return;
      const t = target.current;
      if (t !== null) {
        const d = shortest(t - angle.current);
        if (reduced.current || Math.abs(d) < 0.05) {
          angle.current = t;
          target.current = null;
          resume = performance.now() + 4500;
        } else {
          angle.current += d * 0.085;
        }
      } else if (!paused.current || performance.now() > resume) {
        if (!reduced.current) angle.current += IDLE_SPEED;
      }
      ring.style.transform = `rotateX(-9deg) rotateY(${angle.current}deg)`;

      const tiles = tileRefs.current;
      for (let i = 0; i < tiles.length; i++) {
        const el = tiles[i];
        if (!el) continue;
        const a = (((angle.current + i * STEP) % 360) + 360) % 360;
        const depth = Math.cos((a * Math.PI) / 180); // 1 = front, -1 = back
        const base = 0.28 + 0.72 * ((depth + 1) / 2);
        const dim = dimmed.current.has(TOOLS[i].id) ? 0.22 : 1;
        el.style.opacity = (base * dim).toFixed(3);
        el.style.zIndex = String(Math.round(depth * 50) + 60);
        el.style.filter = depth < 0 ? `blur(${((-depth) * 1.6).toFixed(2)}px)` : "none";
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const links = useMemo(
    () => tool.used.map((u) => ({ label: u, href: TOOL_USE_LINKS[u] })),
    [tool],
  );

  return (
    <section id="tools" className="relative overflow-hidden px-6 py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[40rem] w-[60rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-700/10 blur-[160px]"
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal as="p" variant="fade" className="text-xs uppercase tracking-[0.3em] text-violet-300/70">
            Tools pool
          </Reveal>
          <Reveal as="h2" delay={80} className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-5xl">
            One pool of tools, <span className="text-shimmer">every agent</span> can reach
          </Reveal>
          <Reveal as="p" delay={160} className="mt-4 text-sm leading-7 text-white/60">
            The services, models and infrastructure I wire agents to. Spin the pool, pick a tool, and see where it
            runs across Flows, Agent Studio and client work.
          </Reveal>
        </div>

        <Reveal variant="fade" stagger delay={240} className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {(["All", ...TOOL_CATEGORIES] as const).map((c, i) => (
            <button
              key={c}
              type="button"
              onClick={() => pick(c)}
              aria-pressed={category === c}
              style={{ "--i": i } as CSSProperties}
              className={`rounded-full border px-4 py-1.5 text-xs uppercase tracking-wide transition-all duration-300 hover:-translate-y-0.5 ${
                category === c
                  ? "border-violet-400/70 bg-violet-500/20 text-white shadow-[0_10px_30px_-12px_rgba(167,139,250,0.9)]"
                  : "border-white/15 text-white/60 hover:border-violet-400/50 hover:bg-violet-500/10 hover:text-white"
              }`}
            >
              {c}
            </button>
          ))}
        </Reveal>

        {/* 3D ring */}
        <Reveal variant="scale" threshold={0.2} className="tp-scene relative mt-10">
          <div
            className="tp-stage"
            onMouseEnter={() => (paused.current = true)}
            onMouseLeave={() => (paused.current = false)}
          >
            <div aria-hidden="true" className="tp-floor" />
            <div ref={ringRef} className="tp-ring" role="listbox" aria-label="Tools pool" aria-activedescendant={`tool-${tool.id}`}>
              {TOOLS.map((t, i) => (
                <button
                  key={t.id}
                  id={`tool-${t.id}`}
                  ref={(el) => {
                    tileRefs.current[i] = el;
                  }}
                  type="button"
                  role="option"
                  aria-selected={i === selected}
                  aria-label={t.name}
                  title={t.name}
                  onClick={() => select(i)}
                  onFocus={() => select(i)}
                  className={`tp-tile ${i === selected ? "is-selected" : ""}`}
                  style={
                    {
                      "--a": `${i * STEP}deg`,
                      "--c": t.color,
                    } as CSSProperties
                  }
                >
                  <span className="tp-tile-face">
                    <span className="tp-tile-icon">{t.icon}</span>
                  </span>
                  <span className="tp-tile-name">{t.name}</span>
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Detail card for the selected tool */}
        <div
          key={tool.id}
          className="tp-card mx-auto mt-4 flex max-w-2xl flex-col items-center gap-5 rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-center backdrop-blur sm:flex-row sm:text-left"
          style={{ "--c": tool.color } as CSSProperties}
          aria-live="polite"
        >
          <span className="tp-card-icon grid h-16 w-16 shrink-0 place-items-center rounded-2xl p-3.5">
            {tool.icon}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">{tool.category}</p>
            <h3 className="mt-1 text-lg font-semibold text-white">{tool.name}</h3>
            <p className="mt-1.5 text-sm leading-6 text-white/60">{tool.blurb}</p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <span className="text-[11px] uppercase tracking-[0.2em] text-white/40">Used in</span>
              {links.map(({ label, href }) =>
                href ? (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-violet-400/40 bg-violet-500/10 px-3 py-1 text-xs text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-violet-500/25"
                  >
                    {label} ↗
                  </a>
                ) : (
                  <span key={label} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70">
                    {label}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
