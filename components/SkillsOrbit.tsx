import type { CSSProperties } from "react";
import Logo from "./Logo";
import Reveal from "./Reveal";

function withHighlight(text: string, highlight?: string) {
  if (!highlight) return text;
  const index = text.toLowerCase().indexOf(highlight.toLowerCase());
  if (index === -1) return text;
  return (
    <>
      {text.slice(0, index)}
      <span className="text-violet-400">
        {text.slice(index, index + highlight.length)}
      </span>
      {text.slice(index + highlight.length)}
    </>
  );
}

export default function SkillsOrbit({
  lookingForText,
  lookingForHighlight,
  skills,
}: {
  lookingForText?: string;
  lookingForHighlight?: string;
  skills: string[];
}) {
  return (
    <section className="px-6 py-20 text-center">
      <div className="mx-auto max-w-2xl">
        {lookingForText && (
          <Reveal as="p" className="text-lg text-white/80">
            {withHighlight(lookingForText, lookingForHighlight)}
          </Reveal>
        )}

        <Reveal
          variant="fade"
          stagger
          delay={150}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          {skills.map((skill, i) => (
            <div
              key={skill}
              style={{ "--i": i } as CSSProperties}
              className="flex h-9 items-center justify-center rounded-lg bg-white/5 px-3 text-xs text-white/70 ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-violet-500/15 hover:text-white hover:ring-violet-400/40"
            >
              {skill}
            </div>
          ))}
        </Reveal>
      </div>

      <Reveal variant="scale" className="relative mx-auto mt-16 h-72 w-72">
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-violet-600/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="orbit-ring absolute inset-0 rounded-full border border-white/10"
          style={{ "--dur": "30s" } as CSSProperties}
        >
          <span className="orbit-dot bg-violet-400" />
        </div>
        <div
          aria-hidden="true"
          className="orbit-ring orbit-ring--reverse absolute inset-8 rounded-full border border-white/10"
          style={{ "--dur": "19s" } as CSSProperties}
        >
          <span className="orbit-dot bg-fuchsia-400" />
        </div>
        <div
          aria-hidden="true"
          className="orbit-ring absolute inset-16 rounded-full border border-white/10"
          style={{ "--dur": "11s" } as CSSProperties}
        >
          <span className="orbit-dot bg-white/90" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="orbit-core flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 shadow-[0_0_60px_20px_rgba(139,92,246,0.35)]">
            <Logo className="h-10 w-10 text-white" />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
