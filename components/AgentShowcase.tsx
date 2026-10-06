import { AGENT_STUDIO } from "@/lib/agent";
import AgentScene from "./AgentScene";
import Reveal from "./Reveal";
import { Btn, Chip, Num, SectionHead } from "./ui";

const POINTS = [
  { title: "Orchestrator and sub-agents on a canvas", body: "Connect specialists, write each prompt in plain words, press Polish." },
  { title: "Guardrails and an injection shield", body: "Pattern rules, Llama Prompt Guard 2 and an LLM classifier stop jailbreaks early." },
  { title: "One endpoint, every version", body: "One click compiles the design into a versioned API. Redeploy, same URL." },
];

export default function AgentShowcase() {
  return (
    <section id="agent-studio" className="border-b hairline px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          n={2}
          eyebrow="How I do it · Product two"
          title={[{ text: `${AGENT_STUDIO.name}.` }, { text: AGENT_STUDIO.tagline, className: "text-neutral-500" }]}
        />
        <div className="mt-14 grid items-center gap-16 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
          <Reveal variant="tilt-left" threshold={0.2} className="order-last px-5 pb-14 pt-10 sm:px-12 lg:order-first lg:px-10">
            <div data-cursor="Tilt">
            <AgentScene />
            </div>
          </Reveal>
          <div>
            <Reveal as="p" className="text-base leading-7 text-neutral-300">
              A no-code builder for production AI agents. Design on a canvas, test with a full trace, deploy as an API. Ten minutes in, you have a live endpoint you can call from any language.
            </Reveal>
            <Reveal as="ol" variant="fade" stagger delay={120} className="mt-8 border-t hairline">
              {POINTS.map((p, i) => (
                <li key={p.title} className="grid gap-1 border-b hairline py-4 sm:grid-cols-[4rem_1fr] sm:gap-4" style={{ "--i": i } as React.CSSProperties}>
                  <Num n={i + 1} />
                  <div>
                    <p className="text-sm font-semibold text-white">{p.title}</p>
                    <p className="mt-0.5 text-sm leading-6 text-neutral-400">{p.body}</p>
                  </div>
                </li>
              ))}
            </Reveal>
            <Reveal variant="fade" stagger delay={240} className="mt-6 flex flex-wrap items-center gap-2">
              {AGENT_STUDIO.stack.map((t, i) => (
                <span key={t} style={{ "--i": i } as React.CSSProperties}>
                  <Chip>{t}</Chip>
                </span>
              ))}
            </Reveal>
            <Reveal delay={320} className="mt-8 flex flex-wrap items-center gap-3">
              <Btn href={AGENT_STUDIO.url} solid>
                Try {AGENT_STUDIO.name} free
              </Btn>
              <Btn href="/agent-studio">Use cases &amp; comparison</Btn>
              <span className="label basis-full text-neutral-500">{AGENT_STUDIO.trial}</span>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
