import Image from "next/image";
import type { ProjectCarouselEntry, ProjectEntry } from "@/lib/contentful";

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
      width={160}
      height={64}
      className="h-10 w-auto object-contain opacity-70 transition-opacity duration-300 group-hover:opacity-100 sm:h-12"
    />
  ) : (
    <span className="text-sm font-medium text-white/50">{project.fields.title}</span>
  );

  const className =
    "group flex h-20 w-40 flex-none items-center justify-center rounded-xl bg-white/5 px-6 ring-1 ring-white/10 sm:w-48";

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
    <section className="px-6 py-16">
      <div className="mx-auto max-w-6xl">
        {carousel.fields.title && (
          <p className="text-center text-xs uppercase tracking-wide text-white/40">
            {carousel.fields.title}
          </p>
        )}
        <div className="mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex w-max animate-[carousel-scroll_30s_linear_infinite] gap-6 motion-reduce:animate-none">
            {[...projects, ...projects].map((project, index) => (
              <CarouselTile key={`${project.sys.id}-${index}`} project={project} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
