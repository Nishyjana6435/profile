// Dummy work experience entries — swap in real roles/projects later.
const EXPERIENCE_ITEMS = [
  {
    title: "CIB on the Mobile",
    description:
      "Take your client onboard seamlessly by our amazing tool of digital onboard process.",
  },
  {
    title: "CIB on the Mobile",
    description:
      "Take your client onboard seamlessly by our amazing tool of digital onboard process.",
  },
  {
    title: "CIB on the Mobile",
    description:
      "Take your client onboard seamlessly by our amazing tool of digital onboard process.",
  },
  {
    title: "CIB on the Mobile",
    description:
      "Take your client onboard seamlessly by our amazing tool of digital onboard process.",
  },
];

function ExperienceCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-violet-900/40 to-[#1a0f38] p-6">
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 shrink-0 rounded-lg bg-gradient-to-br from-violet-500/60 to-fuchsia-400/40" />
        <div>
          <h3 className="font-medium text-white">{title}</h3>
          <p className="mt-1 text-sm text-white/60">{description}</p>
          <button className="mt-4 rounded-full border border-white/15 px-4 py-1.5 text-xs uppercase tracking-wide text-white/80 transition-colors hover:border-violet-400/60 hover:text-white">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WorkExperience() {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-2xl font-semibold text-white">Work Experience</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {EXPERIENCE_ITEMS.map((item, index) => (
            <ExperienceCard key={index} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
