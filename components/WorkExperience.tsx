import type { ExperienceItemEntry } from "@/lib/contentful";
import ExperienceShowcase, { type ExperienceView } from "./ExperienceShowcase";
import Reveal from "./Reveal";

function toView(item: ExperienceItemEntry): ExperienceView {
  const f = item.fields;
  const [titleCompany, titleRole] = f.title.split(/\s+[—–-]\s+/);
  const company = f.company ?? titleCompany ?? f.title;
  const role = f.role ?? titleRole ?? f.title;
  const period = f.period;

  // Older entries lead the description with the period; don't show it twice.
  let description = f.description;
  if (period && description.startsWith(period)) {
    description = description.slice(period.length).replace(/^[.\s]+/, "");
  }

  const logo = f.logo && "fields" in f.logo ? f.logo : undefined;
  const logoUrl = logo?.fields.file?.url;
  const url = f.learnMoreUrl && f.learnMoreUrl !== "#" ? f.learnMoreUrl : undefined;

  return {
    id: item.sys.id,
    company,
    role,
    period,
    description,
    highlights: f.highlights ?? [],
    stack: f.stack ?? [],
    logoUrl: logoUrl ? `https:${logoUrl}` : undefined,
    logoAlt: logo?.fields.title || `${company} logo`,
    url,
  };
}

export default function WorkExperience({ items }: { items: ExperienceItemEntry[] }) {
  if (!items || items.length === 0) return null;
  const views = items.map(toView);
  const companies = views.filter((v) => v.company.toLowerCase() !== "freelance").length;

  return (
    <section id="experience" className="relative overflow-hidden px-6 py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-1/3 h-[30rem] w-[30rem] rounded-full bg-fuchsia-600/10 blur-[140px]"
      />
      <div className="relative mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Reveal as="p" variant="fade" className="text-xs uppercase tracking-[0.3em] text-violet-300/70">
              Career
            </Reveal>
            <Reveal as="h2" delay={80} className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
              Where I&apos;ve <span className="text-shimmer">built and led</span>
            </Reveal>
          </div>
          <Reveal as="p" delay={160} className="max-w-sm text-sm leading-6 text-white/50">
            {views.length} roles across {companies} companies, from hands-on full stack engineering to leading
            engineering teams and client delivery.
          </Reveal>
        </div>

        <Reveal variant="fade" delay={200} className="mt-12">
          <ExperienceShowcase items={views} />
        </Reveal>
      </div>
    </section>
  );
}
