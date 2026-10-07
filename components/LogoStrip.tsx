import Image from "next/image";
import type { CSSProperties } from "react";
import ScrollVar from "./ScrollVar";
import type { ExperienceItemEntry } from "@/lib/contentful";
import { AgentLogo } from "./AgentScene";
import { FlowsLogo } from "./FlowsScene";

type Mark = { key: string; name: string; logoUrl?: string; node?: React.ReactNode };

function marks(items: ExperienceItemEntry[]): Mark[] {
  const out: Mark[] = [
    { key: "agent-studio", name: "Agent Studio", node: <AgentLogo className="h-6 w-6" /> },
    { key: "flows", name: "Flows", node: <FlowsLogo className="h-6 w-6" /> },
  ];
  for (const it of items) {
    const logo = it.fields.logo && "fields" in it.fields.logo ? it.fields.logo : undefined;
    const url = logo?.fields.file?.url;
    const name = it.fields.company ?? it.fields.title.split(/\s+[—–-]\s+/)[0];
    if (!url || name.toLowerCase() === "freelance") continue;
    out.push({ key: it.sys.id, name, logoUrl: `https:${url}` });
  }
  return out;
}

/** Companies and products the work shipped through, as a slow marquee of bordered tiles. */
export default function LogoStrip({ items }: { items: ExperienceItemEntry[] }) {
  const list = marks(items);
  if (list.length < 3) return null;
  const copies = 3;
  return (
    <ScrollVar from={0.5} to={0.08} className="strip strip--glow relative overflow-clip border-y border-brand-500/40 py-5" >
      <span aria-hidden="true" className="strip-sheen pointer-events-none absolute inset-y-0 left-0" />
      <span aria-hidden="true" className="strip-curl pointer-events-none absolute bottom-0 right-0" />
      <div className="strip-track flex w-max" style={{ "--dur": `${Math.max(28, list.length * 5)}s`, "--copies": copies } as CSSProperties}>
        {Array.from({ length: copies }, (_, c) => (
          <ul key={c} className="flex gap-4 pr-4" aria-hidden={c > 0}>
            {list.map((m) => (
              <li key={`${c}-${m.key}`} className="flex h-16 w-44 flex-none items-center justify-center rounded-xl border border-brand-500/50 bg-[#121212] px-5 shadow-[0_0_28px_-4px_rgb(var(--accent-500-rgb)/0.55)] transition-all duration-300 hover:border-brand-400 hover:shadow-[0_0_40px_-2px_rgb(var(--accent-500-rgb)/0.9)]">
                {m.node ? (
                  <span className="[&>svg]:h-9 [&>svg]:w-9">{m.node}</span>
                ) : (
                  <span className="relative block h-9 w-28">
                    <Image src={m.logoUrl!} alt="" fill sizes="112px" unoptimized={m.logoUrl!.endsWith(".svg")} className="object-contain brightness-0 invert" />
                  </span>
                )}
                <span className="sr-only">{m.name}</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </ScrollVar>
  );
}
