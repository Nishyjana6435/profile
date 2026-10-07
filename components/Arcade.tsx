"use client";

import { useState, type ReactNode } from "react";
import ShieldGame from "./ShieldGame";
import SnakeGame from "./games/SnakeGame";
import MemoryGame from "./games/MemoryGame";
import { pad } from "@/lib/text";

type Cabinet = { id: string; name: string; blurb: string; controls: string; art: ReactNode; game: ReactNode };

const Art = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 64 40" className="h-10 w-16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);

const CABINETS: Cabinet[] = [
  {
    id: "shield", name: "Shield the agent", blurb: "Shoot the injections, let the customers through.", controls: "Mouse · space · drag",
    art: <Art><path d="M32 6l-6 10h12z" /><path d="M14 26h36" /><circle cx="18" cy="12" r="3" /><circle cx="48" cy="14" r="3" /><path d="M30 32h4v6h-4z" /></Art>,
    game: <ShieldGame />,
  },
  {
    id: "snake", name: "Workflow Snake", blurb: "Grow the workflow one step at a time. Don’t bite your tail.", controls: "Arrows · WASD · swipe",
    art: <Art><path d="M8 30h16V12h16v16h16" /><rect x="52" y="24" width="6" height="6" fill="currentColor" stroke="none" /></Art>,
    game: <SnakeGame />,
  },
  {
    id: "memory", name: "Match the stack", blurb: "Pair the tools behind the products in as few moves as you can.", controls: "Click · tap",
    art: <Art><rect x="6" y="8" width="14" height="24" rx="2" /><rect x="25" y="8" width="14" height="24" rx="2" /><rect x="44" y="8" width="14" height="24" rx="2" /><path d="M10 20h6M29 16l6 8M35 16l-6 8" /></Art>,
    game: <MemoryGame />,
  },
];

/** The arcade shelf: pick a cabinet, the game loads below. */
export default function Arcade() {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div role="tablist" aria-label="Games" className="grid gap-3 sm:grid-cols-3">
        {CABINETS.map((c, i) => {
          const on = i === active;
          return (
            <button
              key={c.id}
              role="tab"
              aria-selected={on}
              aria-controls={`cab-${c.id}`}
              id={`tab-${c.id}`}
              type="button"
              onClick={() => setActive(i)}
              className={`cab group relative rounded-xl border p-4 text-left transition-all duration-300 ${on ? "border-brand-500 bg-brand-500/10 shadow-[0_0_40px_-12px_rgb(var(--accent-500-rgb)/0.8)]" : "border-white/10 bg-white/[0.02] hover:border-white/30"}`}
            >
              <span className="flex items-center justify-between">
                <span className="label text-brand-400">({pad(i + 1)})</span>
                <span className={`transition-colors ${on ? "text-brand-400" : "text-neutral-500 group-hover:text-white"}`}>{c.art}</span>
              </span>
              <span className="display-sm mt-2 block text-lg text-white">{c.name}</span>
              <span className="mt-1 block text-xs leading-5 text-neutral-400">{c.blurb}</span>
              <span className="label mt-3 block text-neutral-500">{c.controls}</span>
              {on && <span aria-hidden="true" className="absolute -bottom-px left-1/2 h-[2px] w-16 -translate-x-1/2 bg-brand-500" />}
            </button>
          );
        })}
      </div>
      <div className="mt-6">
        {CABINETS.map((c, i) => (
          <div key={c.id} id={`cab-${c.id}`} role="tabpanel" aria-labelledby={`tab-${c.id}`} hidden={i !== active}>
            {i === active && c.game}
          </div>
        ))}
      </div>
    </div>
  );
}
