import Link from "next/link";
import Image from "next/image";
import { Fragment, type CSSProperties, type ReactNode } from "react";
import type { ProfileEntry } from "@/lib/contentful";
import Reveal from "./Reveal";

function AnimatedHeadline({
  text,
  highlight,
}: {
  text: string;
  highlight?: string;
}) {
  const words = text.split(/\s+/).filter(Boolean);
  const hl = highlight?.toLowerCase();

  return words.map((word, wi) => {
    const idx = hl ? word.toLowerCase().indexOf(hl) : -1;
    const wordDelay = Math.round((0.35 + wi * 0.09) * 100) / 100;
    let inner: ReactNode = word;
    let open = false;

    if (idx !== -1 && hl) {
      open = true;
      const before = word.slice(0, idx);
      const match = word.slice(idx, idx + hl.length);
      const after = word.slice(idx + hl.length);
      const dots = /^\.+$/.test(after) ? after.split("") : null;
      inner = (
        <>
          {before}
          <span
            className="hero-pill rounded-full border border-violet-400/60 px-2 py-0.5 text-violet-300"
            style={{ "--d": `${wordDelay}s` } as CSSProperties}
          >
            {match}
          </span>
          {dots
            ? dots.map((dot, di) => (
                <span
                  key={di}
                  className="hero-dot"
                  style={
                    { "--d": `${(wordDelay + 0.45 + di * 0.16).toFixed(2)}s` } as CSSProperties
                  }
                >
                  {dot}
                </span>
              ))
            : after}
        </>
      );
    }

    return (
      <Fragment key={wi}>
        {wi > 0 && " "}
        <span
          className={`hero-word${open ? " hero-word--open" : ""}`}
          style={{ "--d": `${wordDelay}s` } as CSSProperties}
        >
          <span>{inner}</span>
        </span>
      </Fragment>
    );
  });
}


type Seg = { text: string; className?: string };

const ROLE_LINE = (title?: string): Seg[] => [
  { text: `I'm an ${title ?? "AI Engineer"} and the` },
  { text: "founder of Flows & Agent Studio.", className: "text-shimmer" },
];
const SUMMARY: Seg[] = [
  { text: "I build AI that does real work:" },
  { text: "agents that plan and act, RAG assistants over your own data,", className: "text-white" },
  { text: "and MCP servers that let AI drive real tools. Behind that sit" },
  { text: "7+ years of full stack engineering", className: "text-white" },
  { text: "across Next.js, Node.js and the cloud, leading teams from 6 to 31 engineers and shipping enterprise platforms for US clients. Tell me what you're building, and I'll put AI to work on it." },
];
const countWords = (segs: Seg[]) => segs.reduce((n, s) => n + s.text.split(/\s+/).filter(Boolean).length, 0);
const ROLE_COUNT = countWords(ROLE_LINE());
const TOTAL_WORDS = ROLE_COUNT + countWords(SUMMARY);
const CHIPS: { label: string; value?: string; href?: string }[] = [
  { value: "7+", label: "years in production software" },
  { value: "2", label: "live AI products" },
  { value: "6→31", label: "engineers led" },
  { label: "Agent Studio", href: "/agent-studio" },
  { label: "Flows", href: "/flows" },
];

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

  return (
    <section className="relative overflow-hidden px-6 pt-20 pb-24">
      <div
        aria-hidden="true"
        className="hero-blob absolute left-1/2 top-24 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-violet-600/25 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="flex flex-col items-start gap-10 sm:flex-row sm:items-center">
          <div className="hero-float relative shrink-0">
            <div className="hero-hello absolute -top-10 left-4 whitespace-nowrap text-xs text-white/60 sm:-top-8">
              Hello! I Am <span className="text-violet-400">{fields?.name}</span>
            </div>
            <div aria-hidden="true" className="hero-ring absolute -inset-1 rounded-full" />
            <div className="relative flex h-40 w-40 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-violet-700/40 to-fuchsia-500/20 ring-1 ring-white/10">
              {avatarFile?.url ? (
                <Image
                  src={`https:${avatarFile.url}`}
                  alt={avatar?.fields.title || fields?.name || "Avatar"}
                  fill
                  className="object-cover"
                  sizes="160px"
                />
              ) : (
                <svg
                  viewBox="0 0 100 100"
                  className="h-24 w-24 text-white/70"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <circle cx="50" cy="32" r="16" />
                  <rect x="22" y="58" width="56" height="30" rx="4" />
                  <rect x="30" y="66" width="40" height="18" rx="2" />
                </svg>
              )}
            </div>
          </div>

          <div>
            {fields?.heroTagline && (
              <p className="hero-tagline text-sm uppercase tracking-wide text-white/50">
                {fields.heroTagline}
              </p>
            )}
            <p className="mt-2 text-3xl font-semibold leading-tight text-white sm:text-4xl">
              {fields?.heroHeadline && (
                <>
                  <span className="sr-only">{fields.heroHeadline}</span>
                  <span aria-hidden="true">
                    <AnimatedHeadline
                      text={fields.heroHeadline}
                      highlight={fields.heroHighlightWord}
                    />
                  </span>
                </>
              )}
            </p>
            {fields?.heroSubheadline && (
              <p className="hero-sub mt-3 max-w-md text-sm italic text-white/50">
                {fields.heroSubheadline}
              </p>
            )}
          </div>
        </div>

        <Reveal variant="fade" threshold={0.25} className="tw mx-auto mt-24 max-w-5xl text-center">
          <p className="tw-eyebrow text-xs uppercase tracking-[0.35em] text-violet-300/70">
            AI engineer · Founder · 7+ years shipping software
          </p>
          <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl">
            {typeWords(ROLE_LINE(fields?.title), 0)}
          </h1>
          <p className="mx-auto mt-8 max-w-3xl text-base leading-8 text-white/65 sm:text-lg sm:leading-9">
            {typeWords(SUMMARY, ROLE_COUNT)}
          </p>
          <ul className="tw-chips mt-10 flex flex-wrap items-center justify-center gap-3" style={{ "--tw-end": TOTAL_WORDS } as CSSProperties}>
            {CHIPS.map((c, i) => (
              <li key={c.label} style={{ "--c": i } as CSSProperties} className="tw-chip">
                {c.href ? (
                  <Link href={c.href} className="inline-flex items-center gap-2 rounded-full border border-violet-400/40 bg-violet-500/10 px-4 py-2 text-xs text-white/85 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-300/70 hover:bg-violet-500/20 hover:text-white">
                    {c.label}
                    <span aria-hidden="true">→</span>
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-xs text-white/75">
                    <span className="font-semibold text-white">{c.value}</span>
                    {c.label}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
