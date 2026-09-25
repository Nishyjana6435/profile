"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties, type MouseEvent } from "react";
import { AGENT_STUDIO } from "@/lib/agent";

type Chip = {
  sub: string;
  label: string;
  pos: string;
  z: number;
  delay: number;
  dot: string;
};

/** Agent nodes floating around the screenshot, at different depths. */
const CHIPS: Chip[] = [
  {
    sub: "Orchestrator",
    label: "Support Copilot · gpt-oss-120b",
    pos: "left-[2%] top-[5%] sm:-left-[7%]",
    z: 150,
    delay: 0,
    dot: "bg-violet-300",
  },
  {
    sub: "Deploy",
    label: "v3 live · same URL",
    pos: "right-[11%] -top-[5%] sm:right-[3%]",
    z: 135,
    delay: 0.35,
    dot: "bg-emerald-400",
  },
  {
    sub: "Injection shield",
    label: "Blocked · score 0.99 · 1 ms",
    pos: "right-[8%] top-[30%] sm:-right-[9%]",
    z: 170,
    delay: 0.7,
    dot: "bg-rose-400",
  },
  {
    sub: "Sub-agent",
    label: "Order Tracker · 630 ms",
    pos: "left-[1%] top-[52%] sm:-left-[9%]",
    z: 160,
    delay: 1.05,
    dot: "bg-sky-400",
  },
];

export function AgentLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      <rect width="32" height="32" rx="9" fill="#f5f5f7" />
      <circle cx="16" cy="10" r="3.4" fill="#7c3aed" />
      <circle cx="9" cy="22" r="2.8" fill="#121317" />
      <circle cx="23" cy="22" r="2.8" fill="#121317" />
      <path
        d="M16 13.6v3.2M14 18.8l-3.2 1.4M18 18.8l3.2 1.4"
        stroke="#121317"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function AgentScene() {
  const ref = useRef<HTMLDivElement | null>(null);

  // Scroll-driven tilt: the stage leans back while low on screen and straightens as it centres.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const p = Math.max(-1, Math.min(1, (r.top + r.height / 2 - vh / 2) / (vh / 2)));
      el.style.setProperty("--sy", `${(p * 9).toFixed(2)}deg`);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${(-y * 14).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(x * 18).toFixed(2)}deg`);
    el.style.setProperty("--dx", `${(x * 24).toFixed(1)}px`);
    el.style.setProperty("--dy", `${(y * 24).toFixed(1)}px`);
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

  return (
    <div
      ref={ref}
      className="fx-scene relative aspect-[5/4] w-full [perspective:1600px] sm:aspect-[4/3]"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div className="fx-stage absolute inset-0">
        <div className="fx-sway absolute inset-0">
          {/* ambient glow, pushed far back */}
          <div
            aria-hidden="true"
            className="fx-glow absolute inset-6 rounded-[3rem] bg-gradient-to-br from-violet-600/70 via-fuchsia-500/40 to-sky-400/20 blur-3xl"
          />

          {/* browser window with the live-site screenshot */}
          <div className="fx-frame absolute inset-0 overflow-hidden rounded-2xl border border-white/15 bg-[#0d0d10] shadow-[0_70px_160px_-50px_rgba(139,92,246,0.75)]">
            <div className="flex h-9 items-center gap-2 border-b border-white/10 bg-[#16161a] px-3.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-3 flex h-5 flex-1 items-center justify-center rounded-md bg-white/[0.06] text-[10px] text-white/50 ring-1 ring-white/10">
                <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="truncate px-1">{AGENT_STUDIO.host}</span>
              </span>
            </div>
            <div className="relative h-[calc(100%-2.25rem)] w-full">
              <Image
                src="/agent/hero.webp"
                alt={`${AGENT_STUDIO.name} landing page: “${AGENT_STUDIO.tagline}”`}
                fill
                priority={false}
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover object-top"
              />
              <span aria-hidden="true" className="fx-scan pointer-events-none absolute inset-x-0 top-0 h-1/5" />
            </div>
            <span aria-hidden="true" className="fx-sheen pointer-events-none absolute inset-0" />
          </div>

          {/* animated wires between the agent nodes */}
          <svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="fx-wire pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          >
            <defs>
              <linearGradient id="ax-wire-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#a78bfa" />
                <stop offset="1" stopColor="#38bdf8" />
              </linearGradient>
            </defs>
            <path id="ax-p1" d="M12 10 C 40 10, 55 -1, 82 -1" />
            <path id="ax-p2" d="M82 -1 C 96 6, 93 22, 88 34" />
            <path id="ax-p3" d="M12 10 C 3 24, 3 42, 11 56" />
            {["ax-p1", "ax-p2", "ax-p3"].map((id, i) => (
              <circle key={id} r="0.8" fill="#bae6fd" className="fx-pulse">
                <animateMotion dur={`${2.2 + i * 0.5}s`} begin={`${i * 0.6}s`} repeatCount="indefinite">
                  <mpath href={`#${id}`} />
                </animateMotion>
              </circle>
            ))}
          </svg>

          {/* trace panel, mid depth */}
          <div
            className="fx-layer absolute left-0 -bottom-[6%] w-[44%] overflow-hidden rounded-xl border border-white/15 bg-[#0e0e12] shadow-[0_30px_80px_-24px_rgba(0,0,0,0.9)] sm:-left-[6%]"
            style={{ "--z": "70px", "--m": 1.2, "--d": "0.1s" } as CSSProperties}
          >
            <Image
              src="/agent/trace.webp"
              alt="Agent Studio playground: an incoming message and the trace of the shield and guardrail stages"
              width={640}
              height={443}
              sizes="(min-width: 1024px) 24vw, 44vw"
              className="h-auto w-full"
            />
          </div>

          {/* canvas panel, front depth */}
          <div
            className="fx-layer absolute right-0 -bottom-[12%] w-[54%] overflow-hidden rounded-xl border border-white/20 bg-[#0e0e12] shadow-[0_40px_100px_-24px_rgba(139,92,246,0.6)] sm:-right-[8%]"
            style={{ "--z": "125px", "--m": 1.45, "--d": "0.25s" } as CSSProperties}
          >
            <Image
              src="/agent/canvas.webp"
              alt="Agent Studio canvas: an orchestrator with a sub-agent, a guardrail and an injection shield, plus a test run"
              width={720}
              height={645}
              sizes="(min-width: 1024px) 30vw, 54vw"
              className="h-auto w-full"
            />
          </div>

          {/* floating agent nodes */}
          {CHIPS.map((chip) => (
            <span
              key={chip.label}
              aria-hidden="true"
              className={`fx-chip absolute ${chip.pos} flex items-center gap-2.5 rounded-xl border border-white/15 bg-[#160b2e]/90 px-3 py-2 shadow-[0_18px_40px_-16px_rgba(139,92,246,0.9)] backdrop-blur`}
              style={{ "--z": `${chip.z}px`, "--m": 1.6, "--d": `${chip.delay}s` } as CSSProperties}
            >
              <span className={`h-2 w-2 shrink-0 rounded-full ${chip.dot} shadow-[0_0_10px_currentColor]`} />
              <span className="leading-tight">
                <span className="block text-[9px] font-medium uppercase tracking-[0.18em] text-white/45">
                  {chip.sub}
                </span>
                <span className="block whitespace-nowrap text-[11px] font-medium text-white sm:text-xs">
                  {chip.label}
                </span>
              </span>
            </span>
          ))}

          {/* product logo badge */}
          <span
            aria-hidden="true"
            className="fx-chip absolute left-[43%] -top-[8%] grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-sky-500 p-2 shadow-[0_20px_50px_-15px_rgba(124,58,237,0.9)] sm:h-14 sm:w-14"
            style={{ "--z": "185px", "--m": 1.6, "--d": "1.3s" } as CSSProperties}
          >
            <AgentLogo className="h-full w-full drop-shadow" />
          </span>
        </div>
      </div>
    </div>
  );
}
