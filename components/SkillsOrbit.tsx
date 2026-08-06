import Logo from "./Logo";

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
          <p className="text-lg text-white/80">
            {withHighlight(lookingForText, lookingForHighlight)}
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {skills.map((skill) => (
            <div
              key={skill}
              className="flex h-9 items-center justify-center rounded-lg bg-white/5 px-3 text-xs text-white/70 ring-1 ring-white/10"
            >
              {skill}
            </div>
          ))}
        </div>
      </div>

      <div className="relative mx-auto mt-16 h-72 w-72">
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-violet-600/20 blur-3xl"
        />
        <div className="absolute inset-0 rounded-full border border-white/10" />
        <div className="absolute inset-8 rounded-full border border-white/10" />
        <div className="absolute inset-16 rounded-full border border-white/10" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 shadow-[0_0_60px_20px_rgba(139,92,246,0.35)]">
            <Logo className="h-10 w-10 text-white" />
          </div>
        </div>
      </div>
    </section>
  );
}
