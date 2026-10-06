import Link from "next/link";
import Logo from "./Logo";
import ScrollProgress from "./ScrollProgress";
import { Btn } from "./ui";

const NAV_LINKS: { label: string; href: string; hideOnMobile?: boolean }[] = [
  { label: "Flows", href: "/flows" },
  { label: "Agent Studio", href: "/agent-studio", hideOnMobile: true },
  { label: "Hire me", href: "/hire" },
  { label: "Blog", href: "/blog" },
];

export default function Header() {
  return (
    <header className="header-in sticky top-0 z-50 border-b hairline bg-[#121212]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-3.5">
        <Link href="/" className="flex items-center gap-2 text-white/90 transition-colors hover:text-white" aria-label="Nishy, home">
          <Logo />
          <span className="display hidden text-sm tracking-[0.08em] sm:inline">Nishy</span>
        </Link>
        <nav className="flex items-center gap-5 sm:gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link label whitespace-nowrap text-neutral-300 transition-colors hover:text-white ${link.hideOnMobile ? "hidden sm:inline" : ""}`}
            >
              {link.label}
            </Link>
          ))}
          <Btn href="/build-ai-system-for-your-business" className="hidden md:inline-flex">
            Build with me
          </Btn>
        </nav>
      </div>
      <ScrollProgress />
    </header>
  );
}
