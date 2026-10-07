import { BUILD_AI_SYSTEM_PAGE } from "@/lib/marketing/ai-engineer-page";
import { firstSentence } from "@/lib/text";
import { Num } from "./ui";
import Reveal from "./Reveal";

/** The four steps of an engagement, one line each. Source of truth lives in the hire page config. */
export default function Process() {
  const steps = BUILD_AI_SYSTEM_PAGE.process.items;
  return (
    <div className="border-t hairline">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <Reveal as="p" variant="fade" className="label text-neutral-400">
          How an engagement runs
        </Reveal>
        <Reveal variant="fade" stagger delay={100} className="mt-8 grid gap-px overflow-hidden rounded-2xl border hairline bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.title} className="bg-[#121212] p-6 transition-colors duration-300 hover:bg-white/[0.03]" style={{ "--i": i } as React.CSSProperties}>
              <Num n={i + 1} />
              <h3 className="display mt-4 text-3xl text-white">{s.title}</h3>
              <p className="mt-3 text-sm leading-6 text-neutral-400">{firstSentence(s.body, 120)}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </div>
  );
}
