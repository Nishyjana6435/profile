import Image from "next/image";
import type { ProjectCarouselEntry, ProjectEntry } from "@/lib/contentful";
import Reveal from "./Reveal";

function CarouselTile({ project }: { project: ProjectEntry }) {
  const asset =
    project.fields.coverImage && "fields" in project.fields.coverImage
      ? project.fields.coverImage
      : undefined;
  const file = asset?.fields.file;

  const content = file?.url ? (
    <Image
      src={`https:${file.url}`}
      alt={asset?.fields.title || project.fields.title}
      width={320}
      height={128}
      className="h-24 w-auto object-contain opacity-70 transition-opacity duration-300 group-hover:opacity-100 sm:h-28"
    />
  ) : (
    <span className="text-xl font-medium text-white/50">{project.fields.title}</span>
  );

  const className =
    "group flex h-44 w-80 flex-none items-center justify-center rounded-2xl bg-white/5 px-12 ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.08] hover:ring-violet-400/40 hover:shadow-[0_24px_60px_-28px_rgba(139,92,246,0.6)] sm:w-96";

  if (project.fields.liveUrl) {
    return (
      <a
        href={project.fields.liveUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {content}
      </a>
    );
  }

  return <div className={className}>{content}</div>;
}

export default function ProjectCarousel({
  carousel,
}: {
  carousel: ProjectCarouselEntry;
}) {
  const projects = (carousel.fields.projects ?? []).filter(
    (project): project is ProjectEntry => Boolean(project && "fields" in project)
  );

  if (projects.length === 0) return null;

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        {carousel.fields.title && (
          <Reveal as="p" variant="fade" className="text-center text-sm uppercase tracking-wide text-white/40">
            {carousel.fields.title}
          </Reveal>
        )}
        <Reveal variant="fade" delay={150} className="mt-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex w-max animate-[carousel-scroll_48s_linear_infinite] gap-10 hover:[animation-play-state:paused] motion-reduce:animate-none">
            {[...projects, ...projects].map((project, index) => (
              <CarouselTile key={`${project.sys.id}-${index}`} project={project} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
