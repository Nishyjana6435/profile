import Logo from "./Logo";

// Dummy tool list — replace with the real stack later.
const TOOLS = ["Fg", "At", "C", "Nd", "Js", "Ts", "Xd", "Sk", "Ai", "Pr"];

export default function SkillsOrbit() {
  return (
    <section className="px-6 py-20 text-center">
      <div className="mx-auto max-w-2xl">
        <p className="text-lg text-white/80">
          I&apos;m currently looking to join a{" "}
          <span className="text-violet-400">cross-functional</span> team
        </p>
        <p className="mt-1 text-sm text-white/50">
          that values improving people&apos;s lives through accessible design
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {TOOLS.map((tool, index) => (
            <div
              key={index}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-xs text-white/70 ring-1 ring-white/10"
            >
              {tool}
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
