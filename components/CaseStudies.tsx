"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { pad } from "@/lib/text";
import { Arrow, Btn, Chip } from "./ui";
import HoverGlide from "./HoverGlide";

export type CaseStudy = {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  imageUrl?: string;
  imageAlt: string;
  liveUrl?: string;
  repoUrl?: string;
  host?: string;
};

/**
 * Case-study index: numbered rows on the left, a sticky spotlight on the right.
 * Hover or tap a row to open it; the spotlight wipes to that project's cover.
 */
export default function CaseStudies({ items }: { items: CaseStudy[] }) {
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const stage = useRef<HTMLDivElement | null>(null);
  const current = items[active];

  const select = (i: number) => {
    if (i === active) return;
    setPrev(active);
    setActive(i);
  };

  // let the outgoing image finish its fade before it is dropped from the stack
  useEffect(() => {
    if (prev === null) return;
    const t = setTimeout(() => setPrev(null), 700);
    return () => clearTimeout(t);
  }, [prev, active]);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = stage.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${(-y * 6).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(x * 8).toFixed(2)}deg`);
    el.style.setProperty("--mx", `${((x + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${((y + 0.5) * 100).toFixed(1)}%`);
  };
  const onLeave = () => {
    const el = stage.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14">
      {/* spotlight */}
      <div className="lg:order-2">
        <div className="sticky top-20 lg:top-24">
          <div ref={stage} onMouseMove={onMove} onMouseLeave={onLeave} data-cursor={current.liveUrl ? "Visit" : undefined} className="cs-stage relative aspect-[4/3] overflow-hidden rounded-2xl border hairline bg-[#161616]">
            <div aria-hidden="true" className="rules absolute inset-0 opacity-70" />
            <span key={active} aria-hidden="true" className="cs-ghost display pointer-events-none absolute -left-3 -top-6 text-[11rem] leading-none text-white/[0.05] sm:text-[15rem]">
              {pad(active + 1)}
            </span>

            <div className="cs-tilt absolute inset-0">
              {items.map((p, i) => {
                const on = i === active;
                const out = i === prev;
                if (!on && !out) return null;
                return (
                  <div key={p.id} className={`cs-slide absolute inset-0 ${on ? "is-on" : "is-out"}`}>
                    <a href={p.liveUrl} target={p.liveUrl ? "_blank" : undefined} rel="noopener noreferrer" aria-label={p.liveUrl ? `Visit ${p.title}` : undefined} className="cs-frame absolute inset-x-[8%] top-[8%] bottom-[10%] overflow-hidden sm:bottom-[19%] border border-white/15 bg-[#0b0b0c] shadow-[0_50px_120px_-40px_rgba(0,0,0,0.9)]">
                      <div className="flex h-8 items-center gap-1.5 border-b border-white/10 bg-[#121212] px-3">
                        <span className="h-2 w-2 rounded-full bg-white/20" />
                        <span className="h-2 w-2 rounded-full bg-white/20" />
                        <span className="h-2 w-2 rounded-full bg-white/20" />
                        <span className="ml-3 truncate font-mono text-[10px] text-white/40">{p.host ?? p.title.toLowerCase().replace(/\s+/g, "-")}</span>
                        <span className="ml-auto hidden whitespace-nowrap font-mono text-[10px] text-white/30 sm:inline">{pad(i + 1)} / {pad(items.length)}</span>
                      </div>
                      <div className="relative h-[calc(100%-2rem)] w-full bg-[radial-gradient(ellipse_at_top,#ffffff,#e9e9ec)]">
                        {p.imageUrl ? (
                          <Image src={p.imageUrl} alt={p.imageAlt} fill sizes="(min-width: 1024px) 45vw, 90vw" className="cs-media object-contain p-6 sm:p-8" />
                        ) : (
                          <span className="grid h-full place-items-center text-2xl font-semibold text-black/40">{p.title}</span>
                        )}
                      </div>
                    </a>
                  </div>
                );
              })}
            </div>

            <span aria-hidden="true" className="cs-sheen pointer-events-none absolute inset-0" />

            {/* caption */}
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4">
              <div className="hidden flex-wrap gap-1.5 sm:flex">
                {current.tags.slice(0, 3).map((t) => (
                  <span key={`${current.id}-${t}`} className="cs-tag label rounded-md border border-white/15 bg-[#121212]/85 px-2 py-1 text-white backdrop-blur">
                    {t}
                  </span>
                ))}
              </div>
              <span className="label hidden shrink-0 whitespace-nowrap text-neutral-500 sm:inline">{pad(active + 1)} / {pad(items.length)}</span>
            </div>
          </div>

          {/* progress */}
          <div className="mt-3 flex gap-1" aria-hidden="true">
            {items.map((p, i) => (
              <span key={p.id} className={`h-[2px] flex-1 transition-colors duration-500 ${i <= active ? "bg-brand-500" : "bg-white/10"}`} />
            ))}
          </div>
        </div>
      </div>

      {/* index */}
      <HoverGlide className="lg:order-1">
      <ol className="border-t hairline">
        {items.map((p, i) => {
          const on = i === active;
          return (
            <li key={p.id} className={`row border-b hairline ${on ? "row-open" : ""}`} onMouseEnter={() => select(i)}>
              <button
                type="button"
                onClick={() => select(i)}
                aria-expanded={on}
                aria-controls={`cs-${p.id}`}
                className="grid w-full grid-cols-[3rem_1fr_2.5rem] items-center gap-4 py-5 text-left outline-none focus-visible:bg-white/[0.03] sm:grid-cols-[4rem_1fr_minmax(0,8rem)_2.5rem]"
              >
                <span className="label text-brand-400">{pad(i + 1)}</span>
                <span className={`row-ghost display-sm block text-xl sm:text-2xl lg:text-[1.7rem] ${on ? "text-white" : "text-neutral-500"}`}>{p.title}</span>
                <span className="label hidden truncate text-right text-neutral-500 sm:block">{p.tags[0]}</span>
                <span className={`grid h-9 w-9 place-items-center rounded-md border hairline transition-all duration-400 ${on ? "bg-brand-500 text-white" : "text-white/60"}`} aria-hidden="true">
                  <Arrow className="h-3.5 w-3.5" />
                </span>
              </button>
              <div id={`cs-${p.id}`} className="row-grid" aria-hidden={!on}>
                <div>
                  <div className="pb-6 sm:pl-[5rem]">
                    <p className="max-w-md text-base leading-7 text-neutral-300">{p.summary}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {p.tags.slice(0, 5).map((t) => (
                        <Chip key={t}>{t}</Chip>
                      ))}
                    </div>
                    {(p.liveUrl || p.repoUrl) && (
                      <div className="mt-5 flex flex-wrap gap-3">
                        {p.liveUrl && (
                          <Btn href={p.liveUrl} solid>
                            Visit live site
                          </Btn>
                        )}
                        {p.repoUrl && <Btn href={p.repoUrl}>Source code</Btn>}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
      </HoverGlide>
    </div>
  );
}

