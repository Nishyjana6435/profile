"use client";

import Image from "next/image";
import { useRef, type CSSProperties, type MouseEvent, type ReactNode } from "react";

export type MarqueeProject = {
  id: string;
  title: string;
  summary?: string;
  tags: string[];
  imageUrl?: string;
  imageAlt: string;
  href?: string;
};

function TiltCard({ project }: { project: MarqueeProject }) {
  const ref = useRef<HTMLElement | null>(null);

  const onMove = (e: MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${((0.5 - y) * 10).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${((x - 0.5) * 14).toFixed(2)}deg`);
    el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  const body: ReactNode = (
    <>
      {/* cursor-tracking gradient border */}
      <span aria-hidden="true" className="pm-border absolute inset-0 rounded-2xl" />
      <span className="absolute inset-px overflow-hidden rounded-[15px] bg-[#110826]">
        {/* blurred backdrop of the cover for depth */}
        {project.imageUrl && (
          <Image
            src={project.imageUrl}
            alt=""
            aria-hidden="true"
            fill
            sizes="352px"
            className="pm-backdrop object-cover opacity-25 blur-2xl saturate-150"
          />
        )}
        {/* spotlight */}
        <span aria-hidden="true" className="pm-spotlight absolute inset-0" />
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.18),transparent_60%)]"
        />

        {/* media */}
        <span className="absolute inset-x-0 top-0 flex h-[62%] items-center justify-center px-10 pt-6">
          {project.imageUrl ? (
            <span className="relative block h-full w-full">
              <Image
                src={project.imageUrl}
                alt={project.imageAlt}
                fill
                sizes="352px"
                className="pm-media object-contain drop-shadow-[0_12px_30px_rgba(0,0,0,0.45)]"
              />
            </span>
          ) : (
            <span className="pm-media text-center text-lg font-medium text-white/60">
              {project.title}
            </span>
          )}
        </span>

        {/* caption */}
        <span className="pm-caption absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 border-t border-white/5 bg-black/20 px-5 py-3 backdrop-blur-sm">
          <span className="truncate text-sm font-medium text-white">{project.title}</span>
          {project.tags[0] && (
            <span className="shrink-0 rounded-full bg-violet-500/15 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-violet-200 ring-1 ring-violet-400/30">
              {project.tags[0]}
            </span>
          )}
        </span>

        {/* hover detail panel */}
        <span className="pm-detail absolute inset-x-0 bottom-0 flex flex-col gap-3 bg-gradient-to-t from-[#0a0514] via-[#0a0514]/95 to-transparent px-5 pb-5 pt-10">
          <span className="text-sm font-semibold text-white">{project.title}</span>
          {project.summary && (
            <span className="line-clamp-3 text-xs leading-5 text-white/65">{project.summary}</span>
          )}
          {project.tags.length > 0 && (
            <span className="flex flex-wrap gap-1.5">
              {project.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-white/[0.06] px-2 py-0.5 text-[10px] text-white/70 ring-1 ring-white/10"
                >
                  {tag}
                </span>
              ))}
            </span>
          )}
          {project.href && (
            <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-violet-300">
              Visit project
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </span>
          )}
        </span>
      </span>
    </>
  );

  const className =
    "pm-card group relative block h-56 w-[19rem] flex-none rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-violet-400 sm:w-[22rem]";

  if (project.href) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        aria-label={`${project.title} (opens in a new tab)`}
      >
        {body}
      </a>
    );
  }

  return (
    <article
      ref={ref as React.RefObject<HTMLElement>}
      tabIndex={0}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      aria-label={project.title}
    >
      {body}
    </article>
  );
}

function Row({
  projects,
  reverse = false,
  duration,
}: {
  projects: MarqueeProject[];
  reverse?: boolean;
  duration: number;
}) {
  return (
    <div
      className={`pm-row flex w-max gap-6 py-3 motion-reduce:animate-none${reverse ? " pm-row--reverse" : ""}`}
      style={{ "--dur": `${duration}s` } as CSSProperties}
    >
      {[...projects, ...projects].map((project, index) => (
        <TiltCard key={`${project.id}-${index}`} project={project} />
      ))}
    </div>
  );
}

export default function ProjectMarquee({ projects }: { projects: MarqueeProject[] }) {
  // Two counter-scrolling rows. With enough projects each row gets its own set;
  // otherwise both rows share the set in different orders.
  const twoSets = projects.length >= 6;
  const rowA = twoSets ? projects.filter((_, i) => i % 2 === 0) : projects;
  const rowB = twoSets ? projects.filter((_, i) => i % 2 === 1) : [...projects].reverse();
  const durA = Math.max(28, rowA.length * 9);
  const durB = Math.max(32, rowB.length * 10);

  return (
    <div className="pm-marquee relative overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <Row projects={rowA} duration={durA} />
      <Row projects={rowB} duration={durB} reverse />
    </div>
  );
}
