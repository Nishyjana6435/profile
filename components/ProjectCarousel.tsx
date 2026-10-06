import type { ProjectCarouselEntry, ProjectEntry } from "@/lib/contentful";
import { firstSentence } from "@/lib/text";
import ProjectDeck from "./ProjectDeck";
import type { MarqueeProject } from "./ProjectMarquee";
import Reveal from "./Reveal";
import { SectionHead } from "./ui";

function toMarqueeProject(project: ProjectEntry): MarqueeProject {
  const asset = project.fields.coverImage && "fields" in project.fields.coverImage ? project.fields.coverImage : undefined;
  const url = asset?.fields.file?.url;
  return {
    id: project.sys.id,
    title: project.fields.title,
    summary: firstSentence(project.fields.summary, 140) || undefined,
    tags: project.fields.tags ?? [],
    imageUrl: url ? `https:${url}` : undefined,
    imageAlt: asset?.fields.title || project.fields.title,
    href: project.fields.liveUrl,
  };
}

export default function ProjectCarousel({ carousel }: { carousel: ProjectCarouselEntry }) {
  const projects = (carousel.fields.projects ?? [])
    .filter((project): project is ProjectEntry => Boolean(project && "fields" in project))
    .map(toMarqueeProject);

  if (projects.length === 0) return null;

  return (
    <section id="proof" className="border-b hairline py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="px-6">
          <SectionHead
            n={4}
            eyebrow={carousel.fields.title ?? "Proof"}
            title={<>Work that shipped<span className="text-neutral-500">.</span></>}
            lead={`${projects.length} projects across AI agents, B2B platforms, IoT and enterprise data. Pick one, or let the deck play.`}
          />
        </div>
        <Reveal variant="fade" delay={200} className="mt-10">
          <ProjectDeck projects={projects} />
        </Reveal>
      </div>
    </section>
  );
}
