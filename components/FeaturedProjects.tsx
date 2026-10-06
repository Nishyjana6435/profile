import type { ProjectEntry } from "@/lib/contentful";
import { richTextToPlainText } from "@/lib/richtext";
import { firstSentence, pad } from "@/lib/text";
import CaseStudies, { type CaseStudy } from "./CaseStudies";
import Reveal from "./Reveal";
import { Eyebrow } from "./ui";
import SplitReveal from "./SplitReveal";

function hostOf(url?: string) {
  if (!url) return undefined;
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return undefined;
  }
}

function toCase(project: ProjectEntry): CaseStudy {
  const asset = project.fields.coverImage && "fields" in project.fields.coverImage ? project.fields.coverImage : undefined;
  const url = asset?.fields.file?.url;
  return {
    id: project.sys.id,
    title: project.fields.title,
    summary: project.fields.summary || firstSentence(richTextToPlainText(project.fields.description), 180),
    tags: project.fields.tags ?? [],
    imageUrl: url ? `https:${url}` : undefined,
    imageAlt: asset?.fields.title || project.fields.title,
    liveUrl: project.fields.liveUrl,
    repoUrl: project.fields.repoUrl,
    host: hostOf(project.fields.liveUrl),
  };
}

export default function FeaturedProjects({ projects }: { projects: ProjectEntry[] }) {
  if (projects.length === 0) return null;
  const items = projects.map(toCase);

  return (
    <section id="featured" className="border-b hairline px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Eyebrow>Case studies</Eyebrow>
            <SplitReveal segs={[{ text: "Real systems," }, { text: "real users.", className: "text-neutral-500" }]} className="display mt-5 text-4xl text-white sm:text-6xl" />
          </div>
          <p className="label text-neutral-500">{pad(items.length)} selected · hover or tap a row</p>
        </div>
        <Reveal variant="fade" delay={120} className="mt-14">
          <CaseStudies items={items} />
        </Reveal>
      </div>
    </section>
  );
}
