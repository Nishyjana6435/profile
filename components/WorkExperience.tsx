import type { ExperienceItemEntry } from "@/lib/contentful";

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
    <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-violet-900/40 to-[#1a0f38] p-6">
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 shrink-0 rounded-lg bg-gradient-to-br from-violet-500/60 to-fuchsia-400/40" />
        <div>
          <h3 className="font-medium text-white">{title}</h3>
          <p className="mt-1 text-sm text-white/60">{description}</p>
          {learnMoreUrl && (
            <a
              href={learnMoreUrl}
              className="mt-4 inline-block rounded-full border border-white/15 px-4 py-1.5 text-xs uppercase tracking-wide text-white/80 transition-colors hover:border-violet-400/60 hover:text-white"
            >
              Learn More
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
        <h2 className="text-2xl font-semibold text-white">Work Experience</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <ExperienceCard
              key={item.sys.id}
              title={item.fields.title}
              description={item.fields.description}
              learnMoreUrl={item.fields.learnMoreUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
