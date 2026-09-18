import type { ProjectCarouselEntry, ProjectEntry } from "@/lib/contentful";
import ProjectMarquee, { type MarqueeProject } from "./ProjectMarquee";
import Reveal from "./Reveal";

function toMarqueeProject(project: ProjectEntry): MarqueeProject {
  const asset =
    project.fields.coverImage && "fields" in project.fields.coverImage
      ? project.fields.coverImage
      : undefined;
  const url = asset?.fields.file?.url;
  return {
    id: project.sys.id,
    title: project.fields.title,
    summary: project.fields.summary,
    tags: project.fields.tags ?? [],
    imageUrl: url ? `https:${url}` : undefined,
    imageAlt: asset?.fields.title || project.fields.title,
    href: project.fields.liveUrl,
  };
}

export default function ProjectCarousel({
  carousel,
}: {
  carousel: ProjectCarouselEntry;
}) {
  const projects = (carousel.fields.projects ?? [])
    .filter((project): project is ProjectEntry => Boolean(project && "fields" in project))
    .map(toMarqueeProject);

  if (projects.length === 0) return null;

  return (
    <section className="relative overflow-hidden px-0 py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[80rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-700/15 blur-[120px]"
      />
      <div className="relative mx-auto max-w-7xl">
        <div className="px-6 text-center">
          {carousel.fields.title && (
            <Reveal as="p" variant="fade" className="text-xs uppercase tracking-[0.3em] text-violet-300/70">
              {carousel.fields.title}
            </Reveal>
          )}
          <Reveal as="h2" delay={80} className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
            Work that shipped, <span className="text-shimmer">at scale</span>
          </Reveal>
          <Reveal as="p" delay={160} className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/50">
            {projects.length} projects across AI agents, B2B platforms, IoT and enterprise data. Hover a card to
            explore.
          </Reveal>
        </div>
        <Reveal variant="fade" delay={240} className="mt-12">
          <ProjectMarquee projects={projects} />
        </Reveal>
      </div>
    </section>
  );
}
