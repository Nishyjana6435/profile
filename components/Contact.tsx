// Dummy contact details — replace with real email/socials later.
const SOCIAL_LINKS = [
  { label: "Instagram", href: "#" },
  { label: "Dribbble", href: "#" },
  { label: "Google", href: "#" },
];

export default function Contact() {
  return (
    <footer className="border-t border-white/5 px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-2xl font-semibold text-white">Contact</h2>
        <p className="mt-4 max-w-xl text-sm leading-6 text-white/60">
          I&apos;m currently looking to join a cross-functional team that values
          improving people&apos;s lives through accessible design, or have a project
          in mind? Let&apos;s connect.
        </p>
        <p className="mt-6 text-sm text-white/80">placeholder@email.com</p>
        <div className="mt-6 flex gap-4">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              aria-label={link.label}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-xs text-white/70 transition-colors hover:border-violet-400/60 hover:text-white"
            >
              {link.label.slice(0, 1)}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
