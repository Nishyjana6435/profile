import Image from "next/image";
import { Fragment, type CSSProperties, type ReactNode } from "react";
import type { ProfileEntry } from "@/lib/contentful";
import { RichText } from "@/lib/richtext";
import TypedText from "./TypedText";

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

export default function Hero({ profile }: { profile: ProfileEntry | null }) {
  const fields = profile?.fields;
  const avatar = fields?.avatar && "fields" in fields.avatar ? fields.avatar : undefined;
  const avatarFile = avatar?.fields.file;

  return (
    <section className="relative overflow-hidden px-6 pt-20 pb-24">
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-24 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-violet-600/25 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="flex flex-col items-start gap-10 sm:flex-row sm:items-center">
          <div className="relative shrink-0">
            <div className="absolute -top-10 left-4 whitespace-nowrap text-xs text-white/60 sm:-top-8">
              Hello! I Am <span className="text-violet-400">{fields?.name}</span>
            </div>
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
            <h1 className="mt-2 text-3xl font-semibold leading-tight text-white sm:text-4xl">
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
            </h1>
            {fields?.heroSubheadline && (
              <p className="hero-sub mt-3 max-w-md text-sm italic text-white/50">
                {fields.heroSubheadline}
              </p>
            )}
          </div>
        </div>

        <div className="mt-20 max-w-2xl">
          <h2 className="min-h-[1.25em] text-2xl font-medium text-white sm:text-3xl">
            <TypedText text={`I'm an ${fields?.title ?? ""}.`} />
          </h2>
          {fields?.currentCompany && (
            <p className="mt-2 text-sm text-white/70">
              Currently, I&apos;m a {fields.title} at{" "}
              <span className="text-violet-400">{fields.currentCompany}</span>.
            </p>
          )}

          <div className="mt-8 text-sm leading-7 text-white/60">
            <RichText document={fields?.bio} />
          </div>
        </div>
      </div>
    </section>
  );
}
