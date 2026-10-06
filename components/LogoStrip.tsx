import Image from "next/image";
import type { CSSProperties } from "react";
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
  const copies = 4;
  return (
    <div className="strip overflow-hidden border-b hairline py-5 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]" aria-label="Companies and products">
      <div className="strip-track flex w-max" style={{ "--dur": `${Math.max(28, list.length * 5)}s`, "--copies": copies } as CSSProperties}>
        {Array.from({ length: copies }, (_, c) => (
          <ul key={c} className="flex gap-4 pr-4" aria-hidden={c > 0}>
            {list.map((m) => (
              <li key={`${c}-${m.key}`} className="flex h-16 w-60 flex-none items-center gap-3 border hairline bg-white/[0.02] px-5 transition-colors duration-300 hover:bg-white/[0.05]">
                {m.node ?? (
                  <span className="relative block h-9 w-20 shrink-0">
                    <Image src={m.logoUrl!} alt="" fill sizes="80px" unoptimized className="object-contain object-left brightness-0 invert" />
                  </span>
                )}
                <span className="truncate text-sm font-medium text-neutral-300">{m.name}</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
