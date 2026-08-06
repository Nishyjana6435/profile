import Image from "next/image";
import type { ProfileEntry } from "@/lib/contentful";
import { RichText } from "@/lib/richtext";

function withHighlight(text: string, highlight?: string) {
  if (!highlight) return text;
  const index = text.toLowerCase().indexOf(highlight.toLowerCase());
  if (index === -1) return text;
  return (
    <>
      {text.slice(0, index)}
      <span className="rounded-full border border-violet-400/60 px-2 py-0.5 text-violet-300">
        {text.slice(index, index + highlight.length)}
      </span>
      {text.slice(index + highlight.length)}
    </>
  );
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
            <p className="text-sm uppercase tracking-wide text-white/50">
              {fields?.heroTagline}
            </p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight text-white sm:text-4xl">
              {fields?.heroHeadline &&
                withHighlight(fields.heroHeadline, fields.heroHighlightWord)}
            </h1>
            <p className="mt-3 max-w-md text-sm italic text-white/50">
              {fields?.heroSubheadline}
            </p>
          </div>
        </div>

        <div className="mt-20 max-w-2xl">
          <h2 className="text-2xl font-medium text-white sm:text-3xl">
            I&apos;m a {fields?.title}.
            <span className="animate-[blink-caret_1s_step-end_infinite] text-violet-400">
              |
            </span>
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
