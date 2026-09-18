"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type KeyboardEvent,
} from "react";

export type ExperienceView = {
  id: string;
  company: string;
  role: string;
  period?: string;
  description: string;
  highlights: string[];
  stack: string[];
  logoUrl?: string;
  logoAlt: string;
  url?: string;
};

const AUTOPLAY_MS = 7000;
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false
  );
}

function Logo({
  item,
  className,
  sizes = "160px",
}: {
  item: ExperienceView;
  className: string;
  sizes?: string;
}) {
  if (!item.logoUrl) {
    return (
      <span
        className={`${className} grid place-items-center bg-gradient-to-br from-violet-500/70 via-fuchsia-400/50 to-violet-500/70 text-lg font-semibold text-white`}
        aria-hidden="true"
      >
        {item.company.charAt(0)}
      </span>
    );
  }
  return (
    <span className={`${className} relative block`}>
      <Image
        src={item.logoUrl}
        alt={item.logoAlt}
        fill
        sizes={sizes}
        unoptimized
        className="object-contain"
      />
    </span>
  );
}

function Panel({ item, index }: { item: ExperienceView; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const long = item.description.length > 180;
  let i = 0;

  return (
    <div
      role="tabpanel"
      id={`exp-panel-${item.id}`}
      aria-labelledby={`exp-tab-${item.id}`}
      className="exp-panel relative min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-900/30 via-[#130a2a] to-[#1a0f38] p-7 shadow-[0_40px_120px_-60px_rgba(139,92,246,0.7)] sm:p-10"
    >
      {/* ambient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl"
      />
      {item.logoUrl && (
        <div
          aria-hidden="true"
          className="exp-watermark pointer-events-none absolute -right-8 -top-6 h-48 w-72 opacity-[0.06] sm:h-56 sm:w-96"
        >
          <Image src={item.logoUrl} alt="" fill sizes="384px" unoptimized className="object-contain" />
        </div>
      )}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-8 top-6 font-mono text-7xl font-bold leading-none text-white/[0.04] sm:text-8xl"
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="relative">
        <div className="exp-line flex flex-wrap items-center gap-5" style={{ "--i": i++ } as CSSProperties}>
          <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white/[0.06] p-3 ring-1 ring-white/10 sm:h-20 sm:w-20">
            <Logo item={item} className="h-full w-full rounded-xl" />
          </div>
          <div className="min-w-0">
            {item.period && (
              <p className="inline-flex items-center gap-2 rounded-full bg-violet-500/15 px-3 py-1 text-[11px] uppercase tracking-wider text-violet-200 ring-1 ring-violet-400/30">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-300 shadow-[0_0_10px_rgba(196,181,253,0.9)]" />
                {item.period}
              </p>
            )}
            <h3 className="mt-2 text-xl font-semibold leading-tight text-white sm:text-2xl">{item.role}</h3>
            <p className="mt-1 text-sm text-white/55">{item.company}</p>
          </div>
        </div>

        <div className="exp-line mt-7" style={{ "--i": i++ } as CSSProperties}>
          <p
            className={`text-sm leading-7 text-white/65 transition-all ${
              long && !expanded ? "line-clamp-2" : ""
            }`}
          >
            {item.description}
          </p>
          {long && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="mt-2 text-xs font-medium text-violet-300 underline-offset-4 hover:underline"
              aria-expanded={expanded}
            >
              {expanded ? "Show less" : "Read more"}
            </button>
          )}
        </div>

        {item.highlights.length > 0 && (
          <ul className="mt-7 grid gap-3 sm:grid-cols-2">
            {item.highlights.map((h) => (
              <li
                key={h}
                className="exp-line group/hl flex gap-3 rounded-xl bg-white/[0.04] p-3.5 text-sm leading-6 text-white/75 ring-1 ring-white/5 transition-colors duration-300 hover:bg-violet-500/10 hover:ring-violet-400/30"
                style={{ "--i": i++ } as CSSProperties}
              >
                <span
                  aria-hidden="true"
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400 shadow-[0_0_10px_rgba(167,139,250,0.8)] transition-transform duration-300 group-hover/hl:scale-150"
                />
                {h}
              </li>
            ))}
          </ul>
        )}

        {item.stack.length > 0 && (
          <div className="exp-line mt-7 flex flex-wrap gap-2" style={{ "--i": i++ } as CSSProperties}>
            {item.stack.map((s) => (
              <span
                key={s}
                className="rounded-lg bg-white/5 px-2.5 py-1 text-xs text-white/70 ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-violet-500/15 hover:text-white hover:ring-violet-400/40"
              >
                {s}
              </span>
            ))}
          </div>
        )}

        {item.url && (
          <div className="exp-line mt-8" style={{ "--i": i++ } as CSSProperties}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-shine group/btn inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2 text-xs uppercase tracking-wide text-white/85 transition-all duration-300 hover:border-violet-400/60 hover:bg-violet-500/10 hover:text-white"
            >
              Visit {item.company}
              <span aria-hidden="true" className="transition-transform duration-300 group-hover/btn:translate-x-1">
                →
              </span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ExperienceShowcase({ items }: { items: ExperienceView[] }) {
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [hovering, setHovering] = useState(false);
  const [inView, setInView] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => setInView(entries.some((e) => e.isIntersecting)),
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const reducedMotion = usePrefersReducedMotion();
  const running = autoplay && !reducedMotion && inView && !hovering && items.length > 1;

  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => setActive((i) => (i + 1) % items.length), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [running, active, items.length]);

  const select = (i: number) => {
    setActive(i);
    setAutoplay(false);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const next =
      e.key === "ArrowDown" || e.key === "ArrowRight"
        ? (active + 1) % items.length
        : e.key === "ArrowUp" || e.key === "ArrowLeft"
          ? (active - 1 + items.length) % items.length
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? items.length - 1
              : null;
    if (next === null) return;
    e.preventDefault();
    select(next);
    tabRefs.current[next]?.focus();
  };

  const current = items[active];

  return (
    <div
      ref={rootRef}
      className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] lg:gap-10"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="relative min-w-0">
        {/* timeline rail (desktop) */}
        <div
          aria-hidden="true"
          className="absolute bottom-6 left-[2.15rem] top-6 hidden w-px bg-gradient-to-b from-transparent via-white/15 to-transparent lg:block"
        />
        <div
          role="tablist"
          aria-label="Companies"
          aria-orientation="vertical"
          onKeyDown={onKeyDown}
          className="-mx-6 flex snap-x gap-3 overflow-x-auto px-6 pb-2 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item, i) => {
            const selected = i === active;
            return (
              <button
                key={item.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`exp-tab-${item.id}`}
                aria-selected={selected}
                aria-controls={`exp-panel-${item.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => select(i)}
                onFocus={() => setHovering(true)}
                onBlur={() => setHovering(false)}
                className="exp-tab group relative flex min-w-[15rem] snap-start items-center gap-4 overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3 text-left outline-none transition-all duration-300 hover:border-white/15 hover:bg-white/[0.06] focus-visible:ring-2 focus-visible:ring-violet-400 lg:min-w-0"
              >
                <span className="exp-node relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-white/[0.06] p-2 ring-1 ring-white/10 transition-all duration-300">
                  <Logo item={item} className="h-full w-full rounded-lg" sizes="96px" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-white">{item.company}</span>
                  <span className="block truncate text-xs text-white/50">{item.period ?? item.role}</span>
                </span>
                <span
                  aria-hidden="true"
                  className={`text-white/30 transition-all duration-300 ${
                    selected ? "translate-x-0 text-violet-300 opacity-100" : "-translate-x-1 opacity-0"
                  }`}
                >
                  →
                </span>
                {selected && running && (
                  <span
                    key={`${active}-${hovering}`}
                    aria-hidden="true"
                    className="exp-progress absolute inset-x-0 bottom-0 h-0.5"
                    style={{ "--dur": `${AUTOPLAY_MS}ms` } as CSSProperties}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {current && <Panel key={current.id} item={current} index={active} />}
    </div>
  );
}
