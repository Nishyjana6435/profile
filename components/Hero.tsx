import Link from "next/link";
import { Fragment, type CSSProperties, type ReactNode } from "react";
import type { ProfileEntry } from "@/lib/contentful";
import HeroNetwork from "./HeroNetwork";
import HeroPortrait from "./HeroPortrait";
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
      <HeroNetwork />

      <Reveal variant="fade" threshold={0.05} className="tw relative mx-auto max-w-6xl text-center">
        <HeroPortrait
          src={avatarFile?.url ? `https:${avatarFile.url}` : undefined}
          alt={`${name} (Nishy), founder of Agent Studio and Flows`}
        />

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
