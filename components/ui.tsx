import Link from "next/link";
import type { ReactNode } from "react";
import { pad } from "@/lib/text";

/** Small red arrow mark, the one accent the theme allows. */
export function Arrow({ className = "h-3 w-3" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

/** Tiny uppercase section marker with the red arrow in front. */
export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`label inline-flex items-center gap-2 text-neutral-400 ${className}`}>
      <Arrow className="h-3 w-3 text-brand-500" />
      <span>{children}</span>
    </p>
  );
}

/** "(01) Label": the numbered tag used on rows and tiles. */
export function Num({ n, children, className = "" }: { n: number; children?: ReactNode; className?: string }) {
  return (
    <span className={`label text-neutral-500 ${className}`}>
      <span className="text-brand-400">({pad(n)})</span>
      {children ? <span className="ml-2 text-neutral-400">{children}</span> : null}
    </span>
  );
}

type BtnProps = {
  href: string;
  children: ReactNode;
  solid?: boolean;
  external?: boolean;
  className?: string;
  icon?: ReactNode;
};

/** Dark or white button with a red icon box, as on the reference site. */
export function Btn({ href, children, solid = false, external = false, className = "", icon }: BtnProps) {
  const cls = `btn ${solid ? "btn--solid" : ""} ${className}`;
  const inner = (
    <>
      <span className="btn-ico">{icon ?? <Arrow className="h-3.5 w-3.5" />}</span>
      <span>{children}</span>
    </>
  );
  if (external || href.startsWith("http") || href.startsWith("#")) {
    return (
      <a href={href} className={cls} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

/** Section opener: chapter number, eyebrow and a big display headline. */
export function SectionHead({
  n,
  eyebrow,
  title,
  lead,
  align = "left",
  className = "",
}: {
  n?: number;
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  const center = align === "center";
  return (
    <div className={`${center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"} ${className}`}>
      <div className={`flex items-center gap-3 ${center ? "justify-center" : ""}`}>
        {n !== undefined && <span className="label text-brand-400">{pad(n)}</span>}
        <Eyebrow>{eyebrow}</Eyebrow>
      </div>
      <h2 className="display mt-5 text-4xl text-white sm:text-6xl">{title}</h2>
      {lead && <p className="mt-5 max-w-xl text-base leading-7 text-neutral-400">{lead}</p>}
    </div>
  );
}

export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="border border-white/10 px-2.5 py-1 font-mono text-[11px] text-neutral-300 transition-colors duration-300 hover:border-white/30 hover:text-white">
      {children}
    </span>
  );
}
