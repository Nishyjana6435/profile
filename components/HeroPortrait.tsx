"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, type CSSProperties, type MouseEvent, type ReactNode } from "react";

type Card = {
  key: string;
  pos: string;
  depth: number;
  d: string;
  dur: string;
  amp: string;
  fx: string;
  href?: string;
  hideMobile?: boolean;
  body: ReactNode;
};

const AgentLogo = () => (
  <svg viewBox="0 0 32 32" className="h-7 w-7 shrink-0 rounded-lg" aria-hidden="true">
    <rect width="32" height="32" rx="9" fill="#f5f5f7" />
    <circle cx="16" cy="10" r="3.4" fill="#7c3aed" />
    <circle cx="9" cy="22" r="2.8" fill="#121317" />
    <circle cx="23" cy="22" r="2.8" fill="#121317" />
    <path d="M16 13.6v3.2M14 18.8l-3.2 1.4M18 18.8l3.2 1.4" stroke="#121317" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const FlowsLogo = () => (
  <svg viewBox="0 0 32 32" className="h-7 w-7 shrink-0 rounded-lg" aria-hidden="true">
    <rect width="32" height="32" rx="9" fill="#f5f5f7" />
    <circle cx="9" cy="16" r="3" fill="#2ee6a6" />
    <circle cx="23" cy="9" r="3" fill="#121317" />
    <circle cx="23" cy="23" r="3" fill="#121317" />
    <path d="M11.5 14.5 20.5 10.2M11.5 17.5l9 4.3" stroke="#121317" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const Dot = ({ c }: { c: string }) => <span className={`inline-block h-1.5 w-1.5 rounded-full ${c}`} />;

const CARDS: Card[] = [
  {
    key: "as",
    pos: "left-[-6.5rem] top-[-4.5rem] sm:left-[-19rem] sm:top-[2%]",
    depth: 1.6, d: "0.5s", dur: "6.5s", amp: "-9px", fx: "-20px", href: "/agent-studio",
    body: (
      <div className="flex items-center gap-2.5">
        <AgentLogo />
        <div className="leading-tight">
          <p className="text-[10px] uppercase tracking-[0.16em] text-violet-300/80">Agent Studio</p>
          <p className="text-xs font-semibold text-white">Support Copilot · v3 live</p>
          <p className="mt-0.5 flex items-center gap-1 font-mono text-[10px] text-emerald-300"><Dot c="bg-emerald-400" /> shield pass · 630 ms</p>
        </div>
      </div>
    ),
  },
  {
    key: "fl",
    pos: "right-[-6.5rem] bottom-[-6.5rem] sm:bottom-auto sm:right-[-19.5rem] sm:top-[30%]",
    depth: 2, d: "0.85s", dur: "7s", amp: "-11px", fx: "20px", href: "/flows",
    body: (
      <div>
        <div className="flex items-center gap-2.5">
          <FlowsLogo />
          <div className="leading-tight">
            <p className="text-[10px] uppercase tracking-[0.16em] text-fuchsia-300/80">Flows</p>
            <p className="text-xs font-semibold text-white">Lead → Slack → Sheet</p>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between gap-3 font-mono text-[10px] text-white/55">
          <span className="flex items-center gap-1 text-emerald-300"><Dot c="bg-emerald-400" /> succeeded</span>
          <span>1.8 s</span>
        </div>
        <div className="mt-1.5 h-[3px] overflow-hidden rounded-full bg-white/10"><div className="hx-card-bar h-full" /></div>
      </div>
    ),
  },
  {
    key: "rag",
    pos: "left-[-18rem] bottom-[6%]",
    depth: 1.2, d: "1.2s", dur: "7.5s", amp: "-7px", fx: "-16px", hideMobile: true,
    body: (
      <div className="leading-tight">
        <p className="text-[10px] uppercase tracking-[0.16em] text-sky-300/80">RAG assistant</p>
        <p className="mt-0.5 text-xs font-semibold text-white">Cited answer from 3 docs</p>
        <div className="mt-1.5 flex gap-1">
          {["policy.pdf", "hr.md", "faq"].map((c) => (
            <span key={c} className="rounded-md bg-sky-400/10 px-1.5 py-0.5 font-mono text-[9px] text-sky-200 ring-1 ring-sky-300/25">{c}</span>
          ))}
        </div>
      </div>
    ),
  },
  {
    key: "lead",
    pos: "right-[-17rem] bottom-[-10%]",
    depth: 1.4, d: "1.5s", dur: "6s", amp: "-8px", fx: "16px", hideMobile: true,
    body: (
      <div className="flex items-center gap-3">
        <div className="leading-none">
          <p className="bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-2xl font-bold text-transparent">7+</p>
          <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-white/45">years</p>
        </div>
        <div className="h-8 w-px bg-white/15" />
        <div className="leading-tight">
          <p className="text-xs font-semibold text-white">Associate Technical Lead</p>
          <p className="text-[10px] text-white/50">Eight25Media · 6→31 engineers led</p>
        </div>
      </div>
    ),
  },
];

export default function HeroPortrait({ src, alt }: { src?: string; alt: string }) {
  const ref = useRef<HTMLDivElement | null>(null);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${(-y * 10).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(x * 14).toFixed(2)}deg`);
    el.style.setProperty("--px", `${(x * 14).toFixed(1)}px`);
    el.style.setProperty("--py", `${(y * 14).toFixed(1)}px`);
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    for (const v of ["--rx", "--ry"]) el.style.setProperty(v, "0deg");
    for (const v of ["--px", "--py"]) el.style.setProperty(v, "0px");
  };

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className="hx-stage relative mx-auto w-[11rem] pb-28 pt-20 sm:w-[16rem] sm:pb-14 sm:pt-12">
      <div className="hx-tilt relative">
        <div aria-hidden="true" className="hx-core-glow absolute -inset-16 rounded-full" />
        <div className="hx-frame">
          <div className="hx-frame-inner aspect-square">
            {src ? (
              <Image src={src} alt={alt} fill priority sizes="256px" className="object-cover" />
            ) : (
              <span className="grid h-full w-full place-items-center text-5xl font-semibold text-white/70">N</span>
            )}
            <span aria-hidden="true" className="hx-scan pointer-events-none" />
                      </div>
          <span className="absolute bottom-[-0.9rem] left-1/2 z-10 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border border-emerald-300/40 bg-[#0a0514]/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-200 backdrop-blur">
            <span className="relative flex h-1.5 w-1.5">
              <span className="fx-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            Founder · Engineer
          </span>
        </div>

        {CARDS.map((c) => {
          const style = { "--depth": c.depth, "--d": c.d, "--dur": c.dur, "--amp": c.amp, "--fx": c.fx } as CSSProperties;
          const cls = `hx-card ${c.pos} ${c.hideMobile ? "hidden sm:block" : ""} ${c.href ? "hx-card-link" : ""}`;
          return c.href ? (
            <Link key={c.key} href={c.href} className={cls} style={style}>
              {c.body}
            </Link>
          ) : (
            <div key={c.key} className={cls} style={style} aria-hidden="true">
              {c.body}
            </div>
          );
        })}
      </div>
    </div>
  );
}
