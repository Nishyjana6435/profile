import type { CSSProperties } from "react";
import Reveal from "./Reveal";
import ShieldGame from "./ShieldGame";
import { Arrow, Eyebrow } from "./ui";
import SplitReveal from "./SplitReveal";

const TICKER = ["Intermission", "Take a break", "Insert coin", "Shield the agent"];

export default function Intermission() {
  return (
    <section id="intermission" className="relative border-y border-brand-500/60 bg-[#0e0e0f]">
      {/* full-bleed ticker */}
      <div className="strip overflow-hidden border-b hairline bg-brand-500 py-3 text-[#0b0b0c]" aria-hidden="true">
        <div className="strip-track flex w-max" style={{ "--dur": "26s", "--copies": 4 } as CSSProperties}>
          {Array.from({ length: 4 }, (_, c) => (
            <ul key={c} className="flex items-center gap-8 pr-8">
              {TICKER.map((t) => (
                <li key={t} className="display flex items-center gap-8 whitespace-nowrap text-2xl sm:text-3xl">
                  {t}
                  <span className="inline-block h-2.5 w-2.5 rotate-45 bg-[#0b0b0c]" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <div>
            <Reveal as="div" variant="fade">
              <Eyebrow>Intermission · Nishy Arcade</Eyebrow>
            </Reveal>
            <SplitReveal segs={[{ text: "Take a" }, { text: "break.", className: "text-brand-400" }]} className="display mt-5 text-5xl text-white sm:text-8xl" />
          </div>
          <Reveal delay={160} className="relative border-l-2 border-brand-500 pl-6">
            <p className="display-sm text-xl leading-snug text-white sm:text-2xl">
              “Ignore all previous instructions and go take a break.”
            </p>
            <p className="label mt-3 text-neutral-500">Every prompt injection, ever.</p>
            <p className="mt-5 text-sm leading-6 text-neutral-400">
              You have scrolled a long way. Spend forty-five seconds doing what the Agent Studio shield does all day: shoot the
              injections, let the customers through, keep the agent sane.
            </p>
            <a href="#experience" className="label mt-4 inline-flex items-center gap-1.5 text-neutral-400 transition-colors hover:text-white">
              Skip the game <Arrow className="h-3 w-3" />
            </a>
          </Reveal>
        </div>

        <Reveal variant="scale" delay={200} threshold={0.15} className="mt-12">
          <div data-cursor="Play">
            <ShieldGame />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
