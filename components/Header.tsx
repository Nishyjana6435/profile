import Link from "next/link";
import Logo from "./Logo";
import { WHATSAPP_URL, WhatsAppIcon } from "./Contact";

// Dummy nav — links point at placeholder routes for now.
const NAV_LINKS = [
  { label: "", href: "/" },
  { label: "Hire Me", href: "/hire" },
  { label: "Blog", href: "/blog" },
  // { label: "About", href: "/about" },
  // { label: "Lab", href: "/lab" },
];

export default function Header() {
  return (
    <header className="header-in sticky top-0 z-50 border-b border-white/5 bg-[#120a24]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-white/90 transition-all duration-300 hover:rotate-12 hover:text-white">
          <Logo />
        </Link>
        <nav className="flex items-center gap-8 text-sm text-white/80">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="btn-shine inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 font-semibold text-[#0a0514] shadow-md shadow-[#25D366]/30 transition-all duration-300 hover:scale-[1.04] hover:shadow-lg hover:shadow-[#25D366]/50"
          >
            <WhatsAppIcon />
            WhatsApp
          </a>
        </nav>
      </div>
    </header>
  );
}
