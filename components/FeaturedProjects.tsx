import type { ProjectEntry } from "@/lib/contentful";
import { RichText } from "@/lib/richtext";
import type { CSSProperties } from "react";
import FeaturedProjectCard, { type FeaturedCardData } from "./FeaturedProjectCard";
import Reveal from "./Reveal";

function toCard(project: ProjectEntry, index: number): FeaturedCardData {
  const asset =
    project.fields.coverImage && "fields" in project.fields.coverImage
      ? project.fields.coverImage
      : undefined;
  const url = asset?.fields.file?.url;
  return {
    index: index + 1,
    title: project.fields.title,
    imageUrl: url ? `https:${url}` : undefined,
    imageAlt: asset?.fields.title || project.fields.title,
    tags: project.fields.tags ?? [],
    href: project.fields.liveUrl,
  };
}

export default function FeaturedProjects({ projects }: { projects: ProjectEntry[] }) {
  if (projects.length === 0) return null;

  return (
    <section id="featured" className="relative overflow-hidden px-6 py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[40rem] w-[60rem] -translate-x-1/2 rounded-full bg-violet-700/10 blur-[140px]"
      />
      <div className="relative mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <Reveal as="p" variant="fade" className="text-xs uppercase tracking-[0.3em] text-violet-300/70">
            Featured work
          </Reveal>
          <Reveal as="h2" delay={80} className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
            Case studies, <span className="text-shimmer">in depth</span>
          </Reveal>
          <Reveal as="p" delay={160} className="mt-3 text-sm leading-6 text-white/50">
            Move your cursor over a project to look around it. Each one is a real system that shipped to real
            users.
          </Reveal>
        </div>

        <div className="mt-16 flex flex-col gap-24 sm:gap-32">
          {projects.map((project, index) => {
            const reversed = index % 2 === 1;
            const card = toCard(project, index);
            return (
              <article
                key={project.sys.id}
                className={`grid items-center gap-12 sm:grid-cols-2 sm:gap-16 ${
                  reversed ? "[&>*:first-child]:sm:order-2" : ""
                }`}
              >
                <Reveal variant={reversed ? "tilt-right" : "tilt-left"} threshold={0.25} className="px-3 sm:px-6">
                  <FeaturedProjectCard data={card} />
                </Reveal>

                <Reveal variant={reversed ? "left" : "right"} delay={150}>
                  <p className="font-mono text-xs text-violet-300/80">
                    {String(index + 1).padStart(2, "0")}
                    <span className="text-white/30"> / {String(projects.length).padStart(2, "0")}</span>
                    <span className="ml-3 text-shimmer uppercase tracking-wide">Featured project</span>
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold leading-tight text-white sm:text-3xl">
                    {project.fields.title}
                  </h3>
                  <div className="mt-4 text-sm leading-7 text-white/60">
                    <RichText document={project.fields.description} />
                  </div>
                  {project.fields.tags && project.fields.tags.length > 0 && (
                    <Reveal variant="fade" stagger delay={300} className="mt-6 flex flex-wrap gap-2">
                      {project.fields.tags.map((tag, i) => (
                        <span
                          key={tag}
                          style={{ "--i": i } as CSSProperties}
                          className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/60 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-400/50 hover:bg-violet-500/10 hover:text-white"
                        >
                          {tag}
                        </span>
                      ))}
                    </Reveal>
                  )}
                  {(project.fields.liveUrl || project.fields.repoUrl) && (
                    <div className="mt-7 flex flex-wrap gap-3">
                      {project.fields.liveUrl && (
                        <a
                          href={project.fields.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-shine group/btn inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-5 py-2 text-xs font-medium uppercase tracking-wide text-white shadow-[0_12px_40px_-12px_rgba(217,70,239,0.8)] transition-transform duration-300 hover:-translate-y-0.5"
                        >
                          Visit live site
                          <span aria-hidden="true" className="transition-transform duration-300 group-hover/btn:translate-x-1">
                            →
                          </span>
                        </a>
                      )}
                      {project.fields.repoUrl && (
                        <a
                          href={project.fields.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2 text-xs uppercase tracking-wide text-white/80 transition-all duration-300 hover:border-violet-400/60 hover:bg-violet-500/10 hover:text-white"
                        >
                          Source code
                        </a>
                      )}
                    </div>
                  )}
                </Reveal>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
