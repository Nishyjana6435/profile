import { FLOWS } from "@/lib/flows";
import FlowsScene from "./FlowsScene";
import Reveal from "./Reveal";
import { Btn, Chip, Num, SectionHead } from "./ui";

const POINTS = [
  { title: "Plain English in, running workflow out", body: "No canvas, no field mapping. Brief it like a new hire." },
  { title: "Claude repairs what breaks", body: "Reads the failed run, explains it in one sentence, offers the fix." },
  { title: "The tools small teams already use", body: "Slack, Google Sheets, Gmail, SMS and any REST API." },
];

export default function FlowsShowcase() {
  return (
    <section id="flows" className="border-b hairline px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          n={2}
          eyebrow="How I do it · Product one"
          title={<>{FLOWS.name}<span className="text-neutral-500">.</span> {FLOWS.tagline}</>}
        />
        <div className="mt-14 grid items-center gap-16 lg:grid-cols-[1fr_1.2fr] lg:gap-14">
          <div>
            <Reveal as="p" className="text-base leading-7 text-neutral-300">
              Workflow automation for small businesses and agencies. Describe a process once. Flows connects your apps, runs it around the clock and tells you in one sentence when something needs you.
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
              {FLOWS.stack.map((t, i) => (
                <span key={t} style={{ "--i": i } as React.CSSProperties}>
                  <Chip>{t}</Chip>
                </span>
              ))}
            </Reveal>
            <Reveal delay={320} className="mt-8 flex flex-wrap items-center gap-3">
              <Btn href={FLOWS.url} solid>
                Try {FLOWS.name} free
              </Btn>
              <Btn href="/flows">Use cases &amp; comparison</Btn>
              <span className="label basis-full text-neutral-500">10 runs a month free · No card required</span>
            </Reveal>
          </div>
          <Reveal variant="tilt-right" threshold={0.2} className="px-5 pb-14 pt-10 sm:px-12 lg:px-10">
            <FlowsScene />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
