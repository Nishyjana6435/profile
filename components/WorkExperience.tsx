import type { ExperienceItemEntry } from "@/lib/contentful";
import Reveal from "./Reveal";

function ExperienceCard({
  title,
  description,
  learnMoreUrl,
}: {
  title: string;
  description: string;
  learnMoreUrl?: string;
}) {
  return (
    <div className="group h-full rounded-2xl border border-white/5 bg-gradient-to-br from-violet-900/40 to-[#1a0f38] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/30 hover:shadow-[0_24px_60px_-24px_rgba(139,92,246,0.5)]">
      <div className="flex items-start gap-4">
        <div className="exp-icon h-10 w-10 shrink-0 rounded-lg bg-gradient-to-br from-violet-500/60 via-fuchsia-400/40 to-violet-500/60" />
        <div>
          <h3 className="font-medium text-white">{title}</h3>
          <p className="mt-1 text-sm text-white/60">{description}</p>
          {learnMoreUrl && (
            <a
              href={learnMoreUrl}
              className="group/btn mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-1.5 text-xs uppercase tracking-wide text-white/80 transition-all duration-300 hover:border-violet-400/60 hover:bg-violet-500/10 hover:text-white"
            >
              Learn More
              <span aria-hidden="true" className="transition-transform duration-300 group-hover/btn:translate-x-1">
                →
              </span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function WorkExperience({
  items,
}: {
  items: ExperienceItemEntry[];
}) {
  if (items?.length === 0) return null;

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <Reveal as="h2" className="text-2xl font-semibold text-white">
          Work Experience
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {items.map((item, index) => (
            <Reveal key={item.sys.id} delay={index * 100} className="h-full">
              <ExperienceCard
                title={item.fields.title}
                description={item.fields.description}
                learnMoreUrl={item.fields.learnMoreUrl}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
