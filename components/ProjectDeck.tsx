"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type PointerEvent } from "react";
import type { MarqueeProject } from "./ProjectMarquee";

const INTERVAL = 5500;
const RM = "(prefers-reduced-motion: reduce)";
const subscribeRM = (cb: () => void) => {
  const m = window.matchMedia(RM);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};

function hostOf(url?: string) {
  if (!url) return undefined;
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return undefined;
  }
}

export default function ProjectDeck({ projects }: { projects: MarqueeProject[] }) {
  const n = projects.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useSyncExternalStore(subscribeRM, () => window.matchMedia(RM).matches, () => false);
  const [cycle, setCycle] = useState(0); // restarts the progress bar
  const stageRef = useRef<HTMLDivElement | null>(null);
  const dragX = useRef<number | null>(null);

  const go = useCallback(
    (i: number) => {
      setActive(((i % n) + n) % n);
      setCycle((c) => c + 1);
    },
    [n],
  );

  useEffect(() => {
    if (paused || reduced || n < 2) return;
    const t = setTimeout(() => go(active + 1), INTERVAL);
    return () => clearTimeout(t);
  }, [active, paused, reduced, n, go, cycle]);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = stageRef.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${(-y * 10).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(x * 14).toFixed(2)}deg`);
    el.style.setProperty("--mx", `${((x + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${((y + 0.5) * 100).toFixed(1)}%`);
  };
  const onLeave = () => {
    const el = stageRef.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    setPaused(false);
  };
  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    dragX.current = e.clientX;
  };
  const onUp = (e: PointerEvent<HTMLDivElement>) => {
    if (dragX.current === null) return;
    const dx = e.clientX - dragX.current;
    dragX.current = null;
    if (Math.abs(dx) > 40) go(active + (dx < 0 ? 1 : -1));
  };

  if (n === 0) return null;

  return (
    <div
      className="pd grid items-center gap-10 overflow-x-clip px-6 pt-10 lg:pt-0 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] lg:gap-14"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* project index */}
      <ol className="hidden flex-col gap-1.5 lg:flex" aria-label="Projects">
        {projects.map((p, i) => {
          const on = i === active;
          return (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => go(i)}
                aria-current={on}
                className={`pd-item group relative flex w-full items-center gap-4 overflow-hidden rounded-2xl px-4 py-3.5 text-left transition-all duration-300 ${
                  on ? "bg-white/[0.06] ring-1 ring-brand-400/40" : "hover:bg-white/[0.03]"
                }`}
              >
                <span
                  className={`font-mono text-xs transition-colors ${on ? "text-brand-300" : "text-white/30 group-hover:text-white/60"}`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={`block truncate text-sm font-medium transition-colors ${on ? "text-white" : "text-white/55 group-hover:text-white/85"}`}
                  >
                    {p.title}
                  </span>
                  {p.tags[0] && (
                    <span className={`mt-0.5 block text-[11px] uppercase tracking-[0.16em] ${on ? "text-brand-300/80" : "text-white/30"}`}>
                      {p.tags.slice(0, 2).join(" · ")}
                    </span>
                  )}
                </span>
                <span
                  aria-hidden="true"
                  className={`text-brand-300 transition-all duration-300 ${on ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"}`}
                >
                  →
                </span>
                {on && (
                  <span
                    key={cycle}
                    aria-hidden="true"
                    className={`pd-progress absolute inset-x-0 bottom-0 h-[2px] origin-left bg-brand-400 ${paused || reduced ? "is-paused" : ""}`}
                    style={{ "--t": `${INTERVAL}ms` } as CSSProperties}
                  />
                )}
              </button>
            </li>
          );
        })}
      </ol>

      {/* 3D stack */}
      <div>
        <div
          ref={stageRef}
          className="pd-stage relative mx-auto aspect-[4/5] w-full max-w-[40rem] touch-pan-y select-none sm:aspect-[4/3.3]"
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          onPointerDown={onDown}
          onPointerUp={onUp}
          aria-roledescription="carousel"
          aria-label="Key projects"
        >
          <div aria-hidden="true" className="pd-glow absolute inset-10 rounded-[3rem] bg-gradient-to-br from-white/15 via-white/5 to-transparent blur-3xl" />
          {projects.map((p, i) => {
            const rel = (i - active + n) % n; // 0 = front, 1..n-1 behind
            const leaving = rel === n - 1 && n > 2; // the one that just left: sinks to the back and fades
            const depth = leaving ? 4 : Math.min(rel, 3);
            const hidden = leaving || rel > 3;
            const host = hostOf(p.href);
            return (
              <article
                key={p.id}
                aria-hidden={rel !== 0}
                className={`pd-card absolute inset-0 ${rel === 0 ? "is-front" : ""} ${hidden ? "is-hidden" : ""}`}
                style={{ "--k": depth, zIndex: 20 - (leaving ? 10 : rel) } as CSSProperties}
                onClick={() => rel !== 0 && go(i)}
              >
                <div className="pd-face relative h-full w-full overflow-hidden rounded-[1.75rem] border border-white/15 bg-[#161616]">
                  {p.imageUrl && (
                    <Image src={p.imageUrl} alt="" aria-hidden="true" fill sizes="640px" className="pd-backdrop object-cover opacity-40 blur-2xl saturate-150" />
                  )}
                  <span aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.25),transparent_60%)]" />

                  {/* browser chrome */}
                  <div className="relative flex h-9 items-center gap-2 border-b border-white/10 bg-black/30 px-4 backdrop-blur">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                    <span className="ml-3 truncate font-mono text-[11px] text-white/45">{host ?? p.title.toLowerCase().replace(/\s+/g, "-")}</span>
                    <span className="ml-auto hidden font-mono text-[11px] text-white/35 sm:inline">
                      {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
                    </span>
                  </div>

                  {/* media */}
                  <div className="relative mx-6 mt-5 h-[46%] sm:mx-10">
                    {p.imageUrl ? (
                      <Image
                        src={p.imageUrl}
                        alt={p.imageAlt}
                        fill
                        sizes="(min-width: 1024px) 520px, 90vw"
                        className="pd-media object-contain drop-shadow-[0_24px_50px_rgba(0,0,0,0.55)]"
                        draggable={false}
                      />
                    ) : (
                      <span className="grid h-full place-items-center text-2xl font-semibold text-white/60">{p.title}</span>
                    )}
                  </div>

                  {/* copy */}
                  <div className="pd-copy absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#121212] via-[#121212]/90 to-transparent px-6 pb-6 pt-14 sm:px-8 sm:pb-7">
                    <div className="flex flex-wrap gap-1.5">
                      {p.tags.slice(0, 4).map((t) => (
                        <span key={t} className="rounded-full bg-brand-500/15 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-brand-100 ring-1 ring-brand-400/30">
                          {t}
                        </span>
                      ))}
                    </div>
                    <h3 className="mt-3 text-xl font-semibold leading-tight text-white sm:text-2xl">{p.title}</h3>
                    {p.summary && <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/65">{p.summary}</p>}
                    {p.href && rel === 0 && (
                      <a
                        href={p.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-shine group/btn mt-4 inline-flex items-center gap-2 rounded-full bg-brand-500 px-5 py-2 text-xs font-medium uppercase tracking-wide text-white shadow-[0_12px_40px_-12px_rgba(0,0,0,0.8)] transition-transform duration-300 hover:-translate-y-0.5"
                      >
                        Visit project
                        <span aria-hidden="true" className="transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
                      </a>
                    )}
                  </div>
                  <span aria-hidden="true" className="pd-spot pointer-events-none absolute inset-0" />
                </div>
              </article>
            );
          })}
        </div>

        {/* controls */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <button type="button" onClick={() => go(active - 1)} aria-label="Previous project" className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/70 transition-all hover:-translate-x-0.5 hover:border-brand-400/60 hover:text-white">
            ←
          </button>
          <div className="flex items-center gap-2">
            {projects.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => go(i)}
                aria-label={`Show ${p.title}`}
                aria-current={i === active}
                className={`h-1.5 rounded-full transition-all duration-500 ${i === active ? "w-8 bg-brand-400" : "w-1.5 bg-white/25 hover:bg-white/50"}`}
              />
            ))}
          </div>
          <button type="button" onClick={() => go(active + 1)} aria-label="Next project" className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/70 transition-all hover:translate-x-0.5 hover:border-brand-400/60 hover:text-white">
            →
          </button>
        </div>
        <p className="sr-only" aria-live="polite">
          {projects[active].title}
        </p>
      </div>
    </div>
  );
}
