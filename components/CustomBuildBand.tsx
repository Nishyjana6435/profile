import Link from "next/link";
import { WHATSAPP_URL, WhatsAppIcon } from "./Contact";
import Reveal from "./Reveal";

const OFFERS = [
  { title: "Custom AI agents", body: "Agents that plan, call your tools and finish real business processes, with guardrails and approval gates." },
  { title: "Custom workflows", body: "Lead capture, reporting, onboarding and support triage wired across the tools your team already uses." },
  { title: "RAG assistants and AI features", body: "Assistants over your own data and AI features inside your product, built to production standard." },
];

export default function CustomBuildBand() {
  return (
    <section id="custom-builds" className="relative overflow-hidden px-6 py-24 sm:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[60rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-700/10 blur-[160px]" />
      <div className="relative mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <Reveal as="p" variant="fade" className="text-xs uppercase tracking-[0.3em] text-violet-300/70">
              Custom builds for clients
            </Reveal>
            <Reveal as="h2" delay={80} className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-5xl">
              Products when they fit. <span className="text-shimmer">Custom builds</span> when they don&apos;t.
            </Reveal>
            <Reveal as="p" delay={160} className="mt-5 max-w-xl text-sm leading-7 text-white/60">
              Flows and Agent Studio cover the common jobs. For everything else I design and build the AI agent,
              workflow or assistant your business actually needs, on your data and your tools, for clients in
              Sri Lanka and worldwide.
            </Reveal>
            <Reveal delay={240} className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/build-ai-system-for-your-business"
                className="btn-shine group/btn inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-2.5 text-xs font-medium uppercase tracking-wide text-white shadow-[0_12px_40px_-12px_rgba(217,70,239,0.8)] transition-transform duration-300 hover:-translate-y-0.5"
              >
                Build an AI system for your business
                <span aria-hidden="true" className="transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-2.5 text-xs uppercase tracking-wide text-white/80 transition-all duration-300 hover:border-violet-400/60 hover:bg-violet-500/10 hover:text-white"
              >
                <WhatsAppIcon />
                Tell me the job
              </a>
              <Link href="/ai-engineer-sri-lanka" className="basis-full text-xs text-white/40 underline-offset-4 hover:text-white hover:underline">
                Based in Sri Lanka? Read how I work with local businesses
              </Link>
            </Reveal>
          </div>
          <Reveal variant="right" stagger delay={200} className="flex flex-col gap-4">
            {OFFERS.map((o) => (
              <div key={o.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-400/40 hover:bg-violet-500/10">
                <h3 className="text-sm font-semibold text-white">{o.title}</h3>
                <p className="mt-1.5 text-xs leading-6 text-white/55">{o.body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
