import type { CSSProperties } from "react";
import { FLOWS } from "@/lib/flows";
import FlowsScene from "./FlowsScene";
import Reveal from "./Reveal";

const FEATURES = [
  {
    title: "Plain English in, running workflow out",
    body: "No canvas, no nodes, no field mapping by hand. Describe it like you'd brief a new hire.",
    icon: <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />,
  },
  {
    title: "Claude repairs what breaks",
    body: "When a run fails, the agent reads the error and the data, explains it in one sentence, and offers the fix.",
    icon: (
      <>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <path d="m22 4-10 10.01-3-3" />
      </>
    ),
  },
  {
    title: "Built for the tools small teams already use",
    body: "Slack, Google Sheets, Gmail, SMS and any REST API. One run is one task, however many steps.",
    icon: (
      <>
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </>
    ),
  },
];

export default function FlowsShowcase() {
  return (
    <section id="flows" className="relative overflow-hidden px-6 py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-10%] top-1/2 h-[36rem] w-[36rem] -translate-y-1/2 rounded-full bg-fuchsia-600/10 blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-10%] top-0 h-[28rem] w-[40rem] rounded-full bg-violet-700/15 blur-[140px]"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-20 lg:grid-cols-[1fr_1.2fr] lg:gap-14">
        <div>
          <Reveal
            as="p"
            variant="fade"
            className="inline-flex items-center gap-2.5 text-xs uppercase tracking-[0.3em] text-violet-300/70"
          >
            <span className="relative flex h-2 w-2">
              <span className="fx-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400" />
              <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            New product · live now
          </Reveal>

          <Reveal as="h2" delay={80} className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-5xl">
            Meet <span className="text-shimmer">{FLOWS.name}</span>
          </Reveal>

          <Reveal as="p" delay={140} className="mt-3 text-xl italic text-white/80 sm:text-2xl">
            “{FLOWS.tagline}”
          </Reveal>

          <Reveal as="p" delay={200} className="mt-5 max-w-xl text-sm leading-7 text-white/60">
            {FLOWS.name} is my own product: an agentic automation platform for small businesses and agencies.
            You describe a process in plain English, and Claude drafts the workflow, wires up your apps,
            runs it around the clock, and tells you in one sentence when something needs you.
          </Reveal>

          <Reveal as="ul" variant="fade" stagger delay={280} className="mt-8 flex flex-col gap-4">
            {FEATURES.map((f, i) => (
              <li
                key={f.title}
                style={{ "--i": i } as CSSProperties}
                className="group flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-400/40 hover:bg-violet-500/10"
              >
                <span className="exp-icon grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-violet-600 text-white shadow-[0_12px_30px_-12px_rgba(217,70,239,0.9)]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    {f.icon}
                  </svg>
                </span>
                <span>
                  <span className="block text-sm font-semibold text-white">{f.title}</span>
                  <span className="mt-1 block text-xs leading-6 text-white/55">{f.body}</span>
                </span>
              </li>
            ))}
          </Reveal>

          <Reveal variant="fade" stagger delay={420} className="mt-7 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-[11px] uppercase tracking-[0.2em] text-white/40">Built with</span>
            {FLOWS.stack.map((tech, i) => (
              <span
                key={tech}
                style={{ "--i": i } as CSSProperties}
                className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/60 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-400/50 hover:bg-violet-500/10 hover:text-white"
              >
                {tech}
              </span>
            ))}
          </Reveal>

          <Reveal delay={500} className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={FLOWS.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-shine group/btn inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-2.5 text-xs font-medium uppercase tracking-wide text-white shadow-[0_12px_40px_-12px_rgba(217,70,239,0.8)] transition-transform duration-300 hover:-translate-y-0.5"
            >
              Try {FLOWS.name} free
              <span aria-hidden="true" className="transition-transform duration-300 group-hover/btn:translate-x-1">
                →
              </span>
            </a>
            <a
              href={`${FLOWS.url}#how`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-2.5 text-xs uppercase tracking-wide text-white/80 transition-all duration-300 hover:border-violet-400/60 hover:bg-violet-500/10 hover:text-white"
            >
              See how it works
            </a>
            <span className="basis-full text-xs text-white/40">10 runs a month free · No card required</span>
          </Reveal>
        </div>

        <Reveal variant="tilt-right" threshold={0.2} className="px-5 pb-14 pt-12 sm:px-12 lg:px-10">
          <FlowsScene />
        </Reveal>
      </div>
    </section>
  );
}
