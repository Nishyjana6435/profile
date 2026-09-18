"use client";

import Image from "next/image";
import { useRef, type CSSProperties, type MouseEvent } from "react";

export type FeaturedCardData = {
  index: number;
  title: string;
  imageUrl?: string;
  imageAlt: string;
  tags: string[];
  href?: string;
};

const CHIP_POSITIONS = [
  "-left-3 top-6 sm:-left-8",
  "-right-3 top-1/3 sm:-right-8",
  "-left-2 bottom-10 sm:-left-6",
];

function hostOf(url?: string, fallback = "") {
  if (!url) return fallback;
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return fallback;
  }
}

export default function FeaturedProjectCard({ data }: { data: FeaturedCardData }) {
  const ref = useRef<HTMLDivElement | null>(null);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${(-y * 16).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(x * 20).toFixed(2)}deg`);
    el.style.setProperty("--dx", `${(x * 26).toFixed(1)}px`);
    el.style.setProperty("--dy", `${(y * 26).toFixed(1)}px`);
    el.style.setProperty("--mx", `${((x + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${((y + 0.5) * 100).toFixed(1)}%`);
    el.classList.add("is-active");
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    for (const v of ["--rx", "--ry"]) el.style.setProperty(v, "0deg");
    for (const v of ["--dx", "--dy"]) el.style.setProperty(v, "0px");
    el.classList.remove("is-active");
  };

  const chips = data.tags.slice(0, 3);
  const urlLabel = hostOf(data.href, data.title.toLowerCase().replace(/\s+/g, "-") + ".app");

  return (
    <div
      ref={ref}
      className="fp-scene relative aspect-[4/3] w-full [perspective:1200px]"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div className="fp-float absolute inset-0">
        {/* glow, pushed back */}
        <div
          aria-hidden="true"
          className="fp-glow absolute inset-8 rounded-[2.5rem] bg-gradient-to-br from-violet-600/60 via-fuchsia-500/35 to-transparent blur-3xl"
        />

        {/* browser window */}
        <div className="fp-frame absolute inset-0 overflow-hidden rounded-2xl border border-white/20 bg-white shadow-[0_60px_140px_-50px_rgba(139,92,246,0.75)]">
          <div className="flex h-9 items-center gap-2 border-b border-black/[0.06] bg-[#f4f2f9] px-3.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-3 flex h-5 flex-1 items-center justify-center rounded-md bg-white text-[10px] text-black/45 ring-1 ring-black/5">
              <span className="truncate px-2">{urlLabel}</span>
            </span>
          </div>
          <div className="relative h-[calc(100%-2.25rem)] w-full bg-[radial-gradient(ellipse_at_top,#ffffff,#ece7f7)] p-6 sm:p-8">
            {data.imageUrl ? (
              <Image
                src={data.imageUrl}
                alt={data.imageAlt}
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="fp-media object-contain p-6 drop-shadow-[0_20px_40px_rgba(30,10,70,0.25)] sm:p-8"
              />
            ) : (
              <div className="flex h-full flex-col gap-3 text-black/60">
                <div className="h-24 w-24 self-center rounded-xl border border-black/15" />
                <div className="mt-2 h-2 w-3/5 self-center rounded bg-black/15" />
                <div className="mt-auto h-2 w-2/5 rounded bg-black/10" />
              </div>
            )}
          </div>
          <span aria-hidden="true" className="fp-sheen pointer-events-none absolute inset-0" />
        </div>

        {/* floating tag chips at different depths */}
        {chips.map((tag, i) => (
          <span
            key={tag}
            aria-hidden="true"
            className={`fp-chip absolute ${CHIP_POSITIONS[i]} rounded-full border border-white/15 bg-[#160b2e]/90 px-3 py-1.5 text-xs font-medium text-white shadow-[0_18px_40px_-16px_rgba(139,92,246,0.9)] backdrop-blur`}
            style={{ "--z": `${70 + i * 35}px`, "--m": 1 + i * 0.6, "--d": `${i * 0.9}s` } as CSSProperties}
          >
            <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400 align-middle" />
            {tag}
          </span>
        ))}

        <span
          aria-hidden="true"
          className="fp-badge absolute -bottom-5 -right-2 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 font-mono text-lg font-bold text-white shadow-[0_20px_50px_-15px_rgba(217,70,239,0.9)] sm:-right-6 sm:h-16 sm:w-16 sm:text-xl"
          style={{ "--z": "90px", "--m": 1.4 } as CSSProperties}
        >
          {String(data.index).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
