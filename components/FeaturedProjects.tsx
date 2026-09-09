import Image from "next/image";
import type { ProjectEntry } from "@/lib/contentful";
import { RichText } from "@/lib/richtext";
import type { CSSProperties } from "react";
import Reveal from "./Reveal";

function ProjectPreview({
  coverImage,
  title,
}: {
  coverImage: ProjectEntry["fields"]["coverImage"];
  title: string;
}) {
  const asset = coverImage && "fields" in coverImage ? coverImage : undefined;
  const file = asset?.fields.file;

  if (file?.url) {
    return (
      <div className="group relative h-64 w-full overflow-hidden rounded-xl bg-white/95 p-8 transition-all duration-500 hover:-rotate-1 hover:shadow-[0_30px_80px_-30px_rgba(139,92,246,0.55)] sm:h-72">
        <Image
          src={`https:${file.url}`}
          alt={asset?.fields.title || title}
          fill
          className="object-contain transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          sizes="(min-width: 640px) 50vw, 100vw"
        />
      </div>
    );
  }

  return (
    <div className="flex h-64 w-full flex-col gap-3 rounded-xl bg-white/95 p-5 text-black/70 sm:h-72">
      <div className="flex h-24 w-24 items-center justify-center self-center rounded border border-black/20">
        <svg
          viewBox="0 0 24 24"
          className="h-10 w-10 text-black/30"
          fill="none"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path d="M3 3l18 18M21 3L3 21" />
        </svg>
      </div>
      <div className="mt-2 h-2 w-3/5 self-center rounded bg-black/20" />
      <div className="mt-auto h-2 w-2/5 rounded bg-black/10" />
    </div>
  );
}

export default function FeaturedProjects({
  projects,
}: {
  projects: ProjectEntry[];
}) {
  if (projects.length === 0) return null;

  return (
    <section className="px-6 py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-20">
        {projects.map((project, index) => {
          const reversed = index % 2 === 1;
          return (
            <div
              key={project.sys.id}
              className={`flex flex-col gap-8 sm:flex-row sm:items-center ${
                reversed ? "sm:flex-row-reverse" : ""
              }`}
            >
              <Reveal variant={reversed ? "right" : "left"} className="w-full sm:w-1/2">
                <ProjectPreview
                  coverImage={project.fields.coverImage}
                  title={project.fields.title}
                />
              </Reveal>
              <Reveal variant={reversed ? "left" : "right"} delay={150} className="w-full sm:w-1/2">
                <p className="text-shimmer inline-block text-xs uppercase tracking-wide">
                  Featured Project
                </p>
                <h3 className="mt-1 text-xl font-semibold text-white">
                  {project.fields.title}
                </h3>
                <div className="mt-3 text-sm leading-6 text-white/60">
                  <RichText document={project.fields.description} />
                </div>
                {project.fields.tags && project.fields.tags.length > 0 && (
                  <Reveal variant="fade" stagger delay={300} className="mt-4 flex flex-wrap gap-2">
                    {project.fields.tags.map((tag, i) => (
                      <span
                        key={tag}
                        style={{ "--i": i } as CSSProperties}
                        className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/60 transition-colors duration-300 hover:border-violet-400/50 hover:text-white"
                      >
                        {tag}
                      </span>
                    ))}
                  </Reveal>
                )}
              </Reveal>
            </div>
          );
        })}
      </div>
    </section>
  );
}
