import { Arrow, Btn, Num, SectionHead } from "./ui";
import Reveal from "./Reveal";
import ScrollWords from "./ScrollWords";

const SERVICES = [
  { title: "AI agents", body: "Plan, call your tools, finish the process. Approval gates keep autonomy safe." },
  { title: "Workflow automation", body: "Lead capture, reporting, onboarding and support triage across Slack, Sheets, Gmail and any API." },
  { title: "RAG assistants & AI features", body: "Assistants over your own documents, and AI inside your product, built to production standard." },
  { title: "Discovery & proof of concept", body: "Fixed scope. A prototype you can click and a roadmap to production." },
];

export default function WhatIDo() {
  return (
    <section id="what" className="border-b hairline px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHead n={1} eyebrow="What I do" title={<>Business processes, <span className="text-neutral-500">run by AI.</span></>} />

        <ScrollWords
          as="p"
          className="display-sm mt-14 max-w-5xl text-2xl text-white sm:text-4xl lg:text-5xl"
          text="You describe the process. I design the agent or workflow, wire it into the tools you already use, and ship it with guardrails, monitoring and a human in the loop where it matters."
          accent={["guardrails", "monitoring"]}
        />

        <Reveal variant="fade" className="mt-16 border-t hairline">
          <ol>
            {SERVICES.map((s, i) => (
              <li key={s.title} className="row group relative grid items-baseline gap-3 border-b hairline py-6 pr-10 sm:grid-cols-[6rem_1fr_1.2fr] sm:gap-8">
                <Num n={i + 1} />
                <h3 className="row-ghost display-sm text-2xl text-neutral-300 sm:text-3xl">{s.title}</h3>
                <p className="text-sm leading-6 text-neutral-400">{s.body}</p>
                <span aria-hidden="true" className="absolute right-0 top-1/2 grid h-9 w-9 -translate-y-1/2 translate-x-3 place-items-center bg-brand-500 text-white opacity-0 transition-all duration-400 group-hover:translate-x-0 group-hover:opacity-100">
                  <Arrow className="h-4 w-4" />
                </span>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={120} className="mt-10 flex flex-wrap items-center gap-3">
          <Btn href="/build-ai-system-for-your-business" solid>
            Build an AI system for your business
          </Btn>
          <Btn href="/ai-engineer-sri-lanka">Based in Sri Lanka?</Btn>
        </Reveal>
      </div>
    </section>
  );
}
