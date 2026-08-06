// Dummy copy and placeholder avatar illustration — replace with real content and artwork later.
export default function Hero() {
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
              Hello! I Am{" "}
              <span className="text-violet-400">Placeholder Name</span>
            </div>
            <div className="relative flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-violet-700/40 to-fuchsia-500/20 ring-1 ring-white/10">
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
            </div>
          </div>

          <div>
            <p className="text-sm uppercase tracking-wide text-white/50">
              A Designer who
            </p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight text-white sm:text-4xl">
              Judges a book by its{" "}
              <span className="rounded-full border border-violet-400/60 px-2 py-0.5 text-violet-300">
                cover
              </span>
              ...
            </h1>
            <p className="mt-3 max-w-md text-sm italic text-white/50">
              Because if the cover does not impress you what else can?
            </p>
          </div>
        </div>

        <div className="mt-20 max-w-2xl">
          <h2 className="text-2xl font-medium text-white sm:text-3xl">
            I&apos;m a Software Engineer.
            <span className="animate-[blink-caret_1s_step-end_infinite] text-violet-400">
              |
            </span>
          </h2>
          <p className="mt-2 text-sm text-white/70">
            Currently, I&apos;m a Software Engineer at{" "}
            <span className="text-violet-400">Placeholder Co.</span>
          </p>

          <p className="mt-8 text-sm leading-7 text-white/60">
            A self-taught UI/UX designer, functioning in the industry for 3+ years now.
            I make meaningful and delightful digital products that create an equilibrium
            between user needs and business goals.
          </p>
        </div>
      </div>
    </section>
  );
}
