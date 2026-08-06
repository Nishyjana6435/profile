import type { SiteSettingsEntry } from "@/lib/contentful";

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
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-xs text-white/70 transition-colors hover:border-violet-400/60 hover:text-white"
              >
                {link.platform.slice(0, 1)}
              </a>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
}
