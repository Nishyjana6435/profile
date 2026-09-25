import type { CSSProperties } from "react";
import { AGENT_STUDIO } from "@/lib/agent";
import AgentScene from "./AgentScene";
import Reveal from "./Reveal";

const FEATURES = [
  {
    title: "Orchestrator and sub-agents on a canvas",
    body: "Drag an orchestrator on, connect specialists it can delegate to, write each prompt in plain words and press Polish.",
    icon: (
      <>
        <circle cx="12" cy="5" r="2.5" />
        <circle cx="5" cy="19" r="2.5" />
        <circle cx="19" cy="19" r="2.5" />
        <path d="M12 7.5v4M10.2 13.6 6.6 17M13.8 13.6l3.6 3.4" />
      </>
    ),
  },
  {
    title: "Guardrails and an injection shield",
    body: "Natural-language policies on input and output. Pattern rules, Llama Prompt Guard 2 and an LLM classifier stop jailbreaks before the model sees them.",
    icon: (
      <>
        <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  },
  {
    title: "One endpoint, every version",
    body: "One click compiles the design into a versioned deployment. Call it with a bearer key from any language, redeploy, same URL.",
    icon: (
      <>
        <path d="m8 7-5 5 5 5M16 7l5 5-5 5" />
        <path d="m14 4-4 16" />
      </>
    ),
  },
];

export default function AgentShowcase() {
  return (
    <section id="agent-studio" className="relative overflow-hidden px-6 py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-10%] top-1/2 h-[36rem] w-[36rem] -translate-y-1/2 rounded-full bg-sky-600/10 blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-10%] bottom-0 h-[28rem] w-[40rem] rounded-full bg-violet-700/15 blur-[140px]"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-20 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
        <Reveal variant="tilt-left" threshold={0.2} className="order-last px-5 pb-14 pt-12 sm:px-12 lg:order-first lg:px-10">
          <AgentScene />
        </Reveal>

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
            Meet <span className="text-shimmer">{AGENT_STUDIO.name}</span>
          </Reveal>

          <Reveal as="p" delay={140} className="mt-3 text-xl italic text-white/80 sm:text-2xl">
            “{AGENT_STUDIO.tagline}”
          </Reveal>

          <Reveal as="p" delay={200} className="mt-5 max-w-xl text-sm leading-7 text-white/60">
            {AGENT_STUDIO.name} is my second product: a no-code builder for production AI agents. You design an
            orchestrator and its sub-agents on a canvas, wrap them in guardrails and a prompt-injection shield,
            test in a playground with a full trace, and hit Deploy. Models run on Groq, and every call, version
            and trace is stored in Neon serverless Postgres, so ten minutes in you have a live endpoint you can
            call from any language.
          </Reveal>

          <Reveal as="ul" variant="fade" stagger delay={280} className="mt-8 flex flex-col gap-4">
            {FEATURES.map((f, i) => (
              <li
                key={f.title}
                style={{ "--i": i } as CSSProperties}
                className="group flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-400/40 hover:bg-violet-500/10"
              >
                <span className="exp-icon grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-500 via-indigo-500 to-sky-500 text-white shadow-[0_12px_30px_-12px_rgba(56,189,248,0.9)]">
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
            <span className="mr-1 text-[11px] uppercase tracking-[0.2em] text-white/40">Runs on</span>
            {AGENT_STUDIO.stack.map((tech, i) => (
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
              href={AGENT_STUDIO.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-shine group/btn inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-sky-500 px-6 py-2.5 text-xs font-medium uppercase tracking-wide text-white shadow-[0_12px_40px_-12px_rgba(56,189,248,0.8)] transition-transform duration-300 hover:-translate-y-0.5"
            >
              Try {AGENT_STUDIO.name} free
              <span aria-hidden="true" className="transition-transform duration-300 group-hover/btn:translate-x-1">
                →
              </span>
            </a>
            <a
              href={`${AGENT_STUDIO.url}#how`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-2.5 text-xs uppercase tracking-wide text-white/80 transition-all duration-300 hover:border-violet-400/60 hover:bg-violet-500/10 hover:text-white"
            >
              See how it works
            </a>
            <span className="basis-full text-xs text-white/40">{AGENT_STUDIO.trial}</span>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
