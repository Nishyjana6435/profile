import type { SiteSettingsEntry } from "@/lib/contentful";

function SocialIcon({ platform }: { platform: string }) {
  const key = platform.toLowerCase();

  if (key.includes("linkedin")) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM3.558 20.452h3.56V9h-3.56v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z" />
      </svg>
    );
  }

  if (key.includes("github")) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.235 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.11.81 2.25 0 1.635-.015 2.945-.015 3.36 0 .315.225.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    );
  }

  return <span className="text-xs">{platform.slice(0, 1)}</span>;
}

export default function Contact({
  siteSettings,
}: {
  siteSettings: SiteSettingsEntry | null;
}) {
  const fields = siteSettings?.fields;
  const socialLinks = fields?.socialLinks ?? [];

  return (
    <footer className="border-t border-white/5 px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-2xl font-semibold text-white">Contact</h2>
        {fields?.siteDescription && (
          <p className="mt-4 max-w-xl text-sm leading-6 text-white/60">
            {fields.siteDescription}
          </p>
        )}
        {fields?.contactEmail && (
          <p className="mt-6 text-sm text-white/80">{fields.contactEmail}</p>
        )}
        {socialLinks.length > 0 && (
          <div className="mt-6 flex gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.platform}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-violet-400/60 hover:text-white"
              >
                <SocialIcon platform={link.platform} />
              </a>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
}
