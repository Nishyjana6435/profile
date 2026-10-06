import type { ProjectEntry } from "@/lib/contentful";
import { richTextToPlainText } from "@/lib/richtext";
import { firstSentence, pad } from "@/lib/text";
import type { CSSProperties } from "react";
import FeaturedProjectCard, { type FeaturedCardData } from "./FeaturedProjectCard";
import Reveal from "./Reveal";
import StackCards from "./StackCards";
import { Btn, Chip, Eyebrow } from "./ui";

function toCard(project: ProjectEntry, index: number): FeaturedCardData {
  const asset = project.fields.coverImage && "fields" in project.fields.coverImage ? project.fields.coverImage : undefined;
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
    <section id="featured" className="border-b hairline px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Eyebrow>Case studies</Eyebrow>
            <h2 className="display mt-5 text-4xl text-white sm:text-6xl">
              Real systems, <span className="text-neutral-500">real users.</span>
            </h2>
          </div>
          <p className="label text-neutral-500">{pad(projects.length)} selected · move your cursor over one</p>
        </div>

        <div className="mt-16">
          <StackCards>
            {projects.map((project, index) => {
              const reversed = index % 2 === 1;
              const card = toCard(project, index);
              const summary = project.fields.summary || firstSentence(richTextToPlainText(project.fields.description), 180);
              return (
                <article
                  key={project.sys.id}
                  className={`grid items-center gap-10 border hairline bg-[#161616] p-6 sm:grid-cols-2 sm:gap-14 sm:p-10 lg:p-14 ${reversed ? "[&>*:first-child]:sm:order-2" : ""}`}
                >
                  <Reveal variant={reversed ? "tilt-right" : "tilt-left"} threshold={0.2} className="px-3 sm:px-4">
                    <FeaturedProjectCard data={card} />
                  </Reveal>

                  <Reveal variant={reversed ? "left" : "right"} delay={120}>
                    <p className="label text-brand-400">
                      ({pad(index + 1)}) <span className="text-neutral-500">/ {pad(projects.length)}</span>
                    </p>
                    <h3 className="display-sm mt-4 text-2xl text-white sm:text-4xl">{project.fields.title}</h3>
                    <p className="mt-4 max-w-md text-base leading-7 text-neutral-400">{summary}</p>
                    {project.fields.tags && project.fields.tags.length > 0 && (
                      <Reveal variant="fade" stagger delay={260} className="mt-6 flex flex-wrap gap-2">
                        {project.fields.tags.slice(0, 5).map((tag, i) => (
                          <span key={tag} style={{ "--i": i } as CSSProperties}>
                            <Chip>{tag}</Chip>
                          </span>
                        ))}
                      </Reveal>
                    )}
                    {(project.fields.liveUrl || project.fields.repoUrl) && (
                      <div className="mt-7 flex flex-wrap gap-3">
                        {project.fields.liveUrl && (
                          <Btn href={project.fields.liveUrl} solid>
                            Visit live site
                          </Btn>
                        )}
                        {project.fields.repoUrl && <Btn href={project.fields.repoUrl}>Source code</Btn>}
                      </div>
                    )}
                  </Reveal>
                </article>
              );
            })}
          </StackCards>
        </div>
      </div>
    </section>
  );
}
