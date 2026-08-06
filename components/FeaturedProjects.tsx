import type { ProjectEntry } from "@/lib/contentful";
import { RichText } from "@/lib/richtext";

function ProjectPreview() {
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
              <div className="w-full sm:w-1/2">
                <ProjectPreview />
              </div>
              <div className="w-full sm:w-1/2">
                <p className="text-xs uppercase tracking-wide text-violet-400">
                  Featured Project
                </p>
                <h3 className="mt-1 text-xl font-semibold text-white">
                  {project.fields.title}
                </h3>
                <div className="mt-3 text-sm leading-6 text-white/60">
                  <RichText document={project.fields.description} />
                </div>
                {project.fields.tags && project.fields.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.fields.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
