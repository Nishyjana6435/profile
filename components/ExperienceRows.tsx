"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { Arrow, Chip } from "./ui";
import { pad } from "@/lib/text";
import HoverGlide from "./HoverGlide";

export type ExperienceRow = {
  id: string;
  company: string;
  role: string;
  period?: string;
  line: string;
  highlights: string[];
  stack: string[];
  logoUrl?: string;
  logo?: ReactNode;
  url?: string;
  founder?: boolean;
};

/** Accordion of roles: one open at a time, giant company name, three highlights max. */
export default function ExperienceRows({ items }: { items: ExperienceRow[] }) {
  const [open, setOpen] = useState(0);

  return (
    <HoverGlide>
    <ol className="border-t hairline">
      {items.map((it, i) => {
        const on = i === open;
        return (
          <li key={it.id} className={`row border-b hairline ${on ? "row-open" : ""}`} onMouseEnter={() => setOpen(i)}>
            <button
              type="button"
              onClick={() => setOpen(on ? -1 : i)}
              aria-expanded={on}
              aria-controls={`exp-${it.id}`}
              className="grid w-full grid-cols-[3rem_1fr_auto] items-center gap-4 py-6 text-left outline-none focus-visible:bg-white/[0.03] sm:grid-cols-[5rem_1fr_minmax(0,22rem)_3rem] sm:gap-8"
            >
              <span className="label text-brand-400">{pad(i + 1)}</span>
              <span className="min-w-0">
                <span className={`row-ghost display block truncate text-3xl sm:text-5xl ${on ? "text-white" : "text-neutral-500"}`}>{it.company}</span>
                <span className="mt-1 block text-sm text-neutral-400 sm:hidden">{it.role}{it.period ? ` · ${it.period}` : ""}</span>
              </span>
              <span className="hidden min-w-0 sm:block">
                <span className="block text-sm font-medium leading-5 text-white">{it.role}</span>
                {it.period && <span className="label mt-1 block text-neutral-500">{it.period}</span>}
              </span>
              <span className="row-plus grid h-9 w-9 place-items-center rounded-md border hairline text-lg leading-none text-white" aria-hidden="true">
                +
              </span>
            </button>

            <div id={`exp-${it.id}`} className="row-grid" aria-hidden={!on}>
              <div>
                <div className="grid gap-6 pb-8 sm:grid-cols-[5rem_1fr] sm:gap-8">
                  <div className="hidden sm:block">
                    {it.logo ? (
                      it.logo
                    ) : it.logoUrl ? (
                      <span className="relative block h-12 w-12 overflow-hidden rounded-md bg-white/90 p-1.5">
                        <Image src={it.logoUrl} alt="" fill sizes="48px" unoptimized className="object-contain p-1" />
                      </span>
                    ) : (
                      <span className="grid h-12 w-12 place-items-center rounded-lg border hairline font-mono text-sm text-white">{it.company.charAt(0)}</span>
                    )}
                  </div>
                  <div className="max-w-3xl">
                    <p className="text-base leading-7 text-neutral-200">{it.line}</p>
                    {it.highlights.length > 0 && (
                      <ul className="mt-5 grid gap-x-8 gap-y-2 sm:grid-cols-3">
                        {it.highlights.map((h, j) => (
                          <li key={h} className="flex gap-2.5 text-sm leading-6 text-neutral-400">
                            <span className="label mt-1.5 shrink-0 text-brand-400">({pad(j + 1)})</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-6 flex flex-wrap items-center gap-2">
                      {it.stack.map((s) => (
                        <Chip key={s}>{s}</Chip>
                      ))}
                      {it.url && (
                        <a href={it.url} target="_blank" rel="noopener noreferrer" className="label ml-auto inline-flex items-center gap-1.5 text-white hover:text-brand-300">
                          Visit <Arrow className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
    </HoverGlide>
  );
}
