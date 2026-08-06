// Dummy project data — replace with real case studies later.
const PROJECTS = [
  {
    title: "Example Project",
    description:
      "A web app for visualizing personalized Spotify data. View your top artists, top tracks, recently played tracks, and detailed audio information about each track. Create and save new playlists of recommended tracks based on your existing playlists and more.",
  },
  {
    title: "Example Project",
    description:
      "A web app for visualizing personalized Spotify data. View your top artists, top tracks, recently played tracks, and detailed audio information about each track. Create and save new playlists of recommended tracks based on your existing playlists and more.",
  },
];

function ProjectPreview() {
  return (
    <div className="flex h-64 w-full flex-col gap-3 rounded-xl bg-white/95 p-5 text-black/70 sm:h-72">
      <div className="flex h-24 w-24 items-center justify-center self-center rounded border border-black/20">
        <svg viewBox="0 0 24 24" className="h-10 w-10 text-black/30" fill="none" stroke="currentColor" aria-hidden="true">
          <path d="M3 3l18 18M21 3L3 21" />
        </svg>
      </div>
      <div className="mt-2 h-2 w-3/5 self-center rounded bg-black/20" />
      <div className="mt-auto h-2 w-2/5 rounded bg-black/10" />
    </div>
  );
}

export default function FeaturedProjects() {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-20">
        {PROJECTS.map((project, index) => {
          const reversed = index % 2 === 1;
          return (
            <div
              key={index}
              className={`flex flex-col gap-8 sm:flex-row sm:items-center ${
                reversed ? "sm:flex-row-reverse" : ""
              }`}
            >
              <div className="w-full sm:w-1/2">
                <ProjectPreview />
              </div>
              <div className="w-full sm:w-1/2">
                <p className="text-xs uppercase tracking-wide text-violet-400">
                  Featured Project
                </p>
                <h3 className="mt-1 text-xl font-semibold text-white">
                  {project.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-white/60">
                  {project.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
