import { BUILD_AI_SYSTEM_PAGE } from "@/lib/marketing/ai-engineer-page";
import { firstSentence } from "@/lib/text";
import Reveal from "./Reveal";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/**
 * The four steps of an engagement, one line each. Source of truth lives in the hire page config.
 * The section keeps the near-black canvas; each step is a solid accent-coloured box with black type.
 */
export default function Process() {
  const steps = BUILD_AI_SYSTEM_PAGE.process.items;
  return (
    <div className="border-t hairline">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <Reveal as="p" variant="fade" className="label text-neutral-400">
          How an engagement runs
        </Reveal>
        <Reveal variant="fade" stagger delay={100} className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="rounded-2xl bg-brand-500 p-6 text-black transition-colors duration-300 hover:bg-brand-400"
              style={{ "--i": i } as React.CSSProperties}
            >
              <span className="label text-black/70">({pad(i + 1)})</span>
              <h3 className="display mt-4 text-3xl text-black">{s.title}</h3>
              <p className="mt-3 text-sm leading-6 text-black/75">{firstSentence(s.body, 120)}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </div>
  );
}
