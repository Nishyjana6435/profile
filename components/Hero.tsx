import Image from "next/image";
import Link from "next/link";
import { Fragment, type CSSProperties, type ReactNode } from "react";
import type { ProfileEntry } from "@/lib/contentful";
import Reveal from "./Reveal";

type Seg = { text: string; className?: string };

/* ---------- Wording ---------- */
const HEADLINE: Seg[] = [
  { text: "Founder of" },
  { text: "Agent Studio & Flows.", className: "text-shimmer" },
  { text: "I build AI that runs the business." },
];
const SUMMARY: Seg[] = [
  { text: "I started Agent Studio and Flows to get AI out of the demo and into daily work. I bring that" },
  { text: "founder's ownership", className: "text-white" },
  { text: "to every client build and every team I lead:" },
  { text: "7+ years of full stack engineering,", className: "text-white" },
  { text: "production RAG and agent systems, and engineering leadership as" },
  { text: "Associate Technical Lead at Eight25Media.", className: "text-white" },
];
const DOORS = [
  { who: "For businesses", label: "Build an AI system with me", href: "/build-ai-system-for-your-business", primary: true },
  { who: "For recruiters", label: "See my career & leadership", href: "/about", primary: false },
];
const STATS = [
  { value: "7+", label: "years shipping software" },
  { value: "2", label: "AI products founded" },
  { value: "6→31", label: "engineers led" },
  { value: "US", label: "enterprise clients" },
];

/* Orbiting planets around the photo */
const OUTER: { label: string; href?: string; kind: "as" | "fl" | "tag" }[] = [
  { label: "Agent Studio", href: "/agent-studio", kind: "as" },
  { label: "RAG", kind: "tag" },
  { label: "Flows", href: "/flows", kind: "fl" },
  { label: "AI agents", kind: "tag" },
  { label: "MCP", kind: "tag" },
];
const INNER = ["Next.js", "Node.js", "Azure AI", "TypeScript"];

const countWords = (segs: Seg[]) => segs.reduce((n, s) => n + s.text.split(/\s+/).filter(Boolean).length, 0);
const HEAD_COUNT = countWords(HEADLINE);
const TOTAL_WORDS = HEAD_COUNT + countWords(SUMMARY);

/** Words stay in the HTML for crawlers; CSS types them in one by one. */
function typeWords(segs: Seg[], start: number): ReactNode[] {
  let i = start;
  const out: ReactNode[] = [];
  segs.forEach((seg, si) => {
    seg.text.split(/\s+/).filter(Boolean).forEach((w, wi) => {
      out.push(
        <Fragment key={`${si}-${wi}`}>
          <span className={`tw-word ${seg.className ?? ""}`} style={{ "--w": i } as CSSProperties}>
            {w}
          </span>{" "}
        </Fragment>,
      );
      i += 1;
    });
  });
  return out;
}

function PlanetIcon({ kind }: { kind: "as" | "fl" | "tag" }) {
  if (kind === "as")
    return (
      <svg viewBox="0 0 32 32" className="h-6 w-6 shrink-0 rounded-lg" aria-hidden="true">
        <rect width="32" height="32" rx="9" fill="#f5f5f7" />
        <circle cx="16" cy="10" r="3.4" fill="#7c3aed" />
        <circle cx="9" cy="22" r="2.8" fill="#121317" />
        <circle cx="23" cy="22" r="2.8" fill="#121317" />
        <path d="M16 13.6v3.2M14 18.8l-3.2 1.4M18 18.8l3.2 1.4" stroke="#121317" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  if (kind === "fl")
    return (
      <svg viewBox="0 0 32 32" className="h-6 w-6 shrink-0 rounded-lg" aria-hidden="true">
        <rect width="32" height="32" rx="9" fill="#f5f5f7" />
        <circle cx="9" cy="16" r="3" fill="#2ee6a6" />
        <circle cx="23" cy="9" r="3" fill="#121317" />
        <circle cx="23" cy="23" r="3" fill="#121317" />
        <path d="M11.5 14.5 20.5 10.2M11.5 17.5l9 4.3" stroke="#121317" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  return <span className="h-2 w-2 shrink-0 rounded-full bg-gradient-to-r from-violet-300 to-fuchsia-300 shadow-[0_0_10px_rgba(240,171,252,0.9)]" />;
}

export default function Hero({ profile }: { profile: ProfileEntry | null }) {
  const fields = profile?.fields;
  const avatar = fields?.avatar && "fields" in fields.avatar ? fields.avatar : undefined;
  const avatarFile = avatar?.fields.file;
  const name = fields?.name ?? "Nishanthan Janarthanarajah";

  return (
    <section className="hx relative overflow-hidden px-6 pb-16 pt-10 sm:pb-20 sm:pt-14">
      {/* backdrop */}
      <div aria-hidden="true" className="hx-grid pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="hx-aurora pointer-events-none absolute left-1/2 top-[-10%] h-[46rem] w-[70rem] -translate-x-1/2" />
      <span aria-hidden="true" className="hx-watermark pointer-events-none absolute left-1/2 top-[7rem] -translate-x-1/2 select-none sm:top-[8rem]">
        FOUNDER
      </span>

      <Reveal variant="fade" threshold={0.05} className="tw relative mx-auto max-w-6xl text-center">
        {/* orbit system around the photo */}
        <div className="hx-system relative mx-auto" aria-label="Nishy and what he builds">
          <div className="hx-orbit hx-orbit--outer" aria-hidden="true">
            <div className="hx-ring" />
          </div>
          <div className="hx-orbit hx-orbit--inner" aria-hidden="true">
            <div className="hx-ring hx-ring--dashed" />
          </div>

          {/* inner orbit: stack */}
          <div className="hx-plane hx-plane--inner">
            <div className="hx-spin hx-spin--inner">
              {INNER.map((t, i) => (
                <div key={t} className="hx-slot" style={{ "--a": `${(360 / INNER.length) * i}deg` } as CSSProperties}>
                  <span className="hx-planet hx-planet--small">{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* photo core */}
          <div className="hx-core absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
            <div aria-hidden="true" className="hx-core-ring absolute -inset-2 rounded-full" />
            <div aria-hidden="true" className="hx-core-glow absolute -inset-10 rounded-full" />
            <div className="relative h-32 w-32 overflow-hidden rounded-full ring-2 ring-white/15 sm:h-48 sm:w-48">
              {avatarFile?.url ? (
                <Image
                  src={`https:${avatarFile.url}`}
                  alt={`${name} (Nishy), founder of Agent Studio and Flows`}
                  fill
                  priority
                  sizes="192px"
                  className="object-cover"
                />
              ) : (
                <span className="grid h-full w-full place-items-center bg-violet-900/60 text-4xl font-semibold">N</span>
              )}
            </div>
            <span className="hx-badge absolute -bottom-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border border-emerald-300/40 bg-[#0a0514]/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-200 backdrop-blur">
              <span className="relative flex h-1.5 w-1.5">
                <span className="fx-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              Founder · Engineer
            </span>
          </div>

          {/* outer orbit: products + skills */}
          <div className="hx-plane hx-plane--outer">
            <div className="hx-spin hx-spin--outer">
              {OUTER.map((p, i) => {
                const inner = (
                  <span className={`hx-planet ${p.kind !== "tag" ? "hx-planet--product" : ""}`}>
                    <PlanetIcon kind={p.kind} />
                    {p.label}
                  </span>
                );
                return (
                  <div key={p.label} className="hx-slot" style={{ "--a": `${(360 / OUTER.length) * i}deg` } as CSSProperties}>
                    {p.href ? (
                      <Link href={p.href} className="hx-planet-link" aria-label={`${p.label}, founded by Nishy`}>
                        {inner}
                      </Link>
                    ) : (
                      inner
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* copy */}
        <p className="tw-eyebrow mt-4 text-xs uppercase tracking-[0.3em] text-white/55 sm:text-sm">
          Hi, I&apos;m <span className="text-violet-300">{name}</span> · Nishy
        </p>
        <h1 className="mx-auto mt-5 max-w-5xl text-4xl font-semibold leading-[1.06] tracking-tight text-white sm:text-6xl lg:text-7xl">
          {typeWords(HEADLINE, 0)}
        </h1>
        <p className="mx-auto mt-7 max-w-3xl text-base leading-8 text-white/65 sm:text-lg sm:leading-9">{typeWords(SUMMARY, HEAD_COUNT)}</p>

        {/* two doors */}
        <div className="tw-chip mx-auto mt-10 grid max-w-2xl gap-3 sm:grid-cols-2" style={{ "--tw-end": TOTAL_WORDS, "--c": 0 } as CSSProperties}>
          {DOORS.map((d) => (
            <Link
              key={d.href}
              href={d.href}
              className={`hx-door group relative flex items-center justify-between gap-3 overflow-hidden rounded-2xl px-5 py-4 text-left transition-all duration-300 hover:-translate-y-1 ${
                d.primary
                  ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow-[0_20px_50px_-20px_rgba(217,70,239,0.9)]"
                  : "border border-white/15 bg-white/[0.04] hover:border-violet-400/60 hover:bg-violet-500/10"
              }`}
            >
              <span>
                <span className={`block text-[10px] uppercase tracking-[0.22em] ${d.primary ? "text-white/75" : "text-violet-300/80"}`}>{d.who}</span>
                <span className="mt-0.5 block text-sm font-semibold text-white">{d.label}</span>
              </span>
              <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/15 text-white transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          ))}
        </div>

        <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4" style={{ "--tw-end": TOTAL_WORDS } as CSSProperties}>
          {STATS.map((s, i) => (
            <li key={s.label} className="tw-chip text-center" style={{ "--c": i + 1 } as CSSProperties}>
              <span className="block text-2xl font-semibold text-white sm:text-3xl">{s.value}</span>
              <span className="block text-[11px] uppercase tracking-[0.16em] text-white/45">{s.label}</span>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
