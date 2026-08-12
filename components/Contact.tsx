import type { SiteSettingsEntry } from "@/lib/contentful";

export const WHATSAPP_URL =
  "https://wa.me/94777125043?text=Hi%2C%20I%27d%20like%20to%20get%20in%20touch";

export function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.149-.15.298-.347.446-.522.15-.174.198-.298.298-.497.099-.198.05-.371-.05-.52-.099-.148-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z" />
      <path d="M12.001 2C6.478 2 2 6.477 2 12c0 1.876.51 3.634 1.397 5.144L2 22l4.98-1.306A9.953 9.953 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12.001 2Zm0 18.2a8.19 8.19 0 0 1-4.166-1.15l-.298-.177-2.955.775.79-2.881-.194-.297A8.183 8.183 0 0 1 3.8 12c0-4.522 3.679-8.2 8.201-8.2 4.521 0 8.199 3.678 8.199 8.2 0 4.521-3.678 8.2-8.199 8.2Z" />
    </svg>
  );
}

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

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-[#0a0514] shadow-lg shadow-[#25D366]/20 transition-transform hover:scale-[1.03] hover:shadow-[#25D366]/40"
        >
          <WhatsAppIcon />
          Chat on WhatsApp
        </a>

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
