import type { CSSProperties } from "react";
import CountUp from "./CountUp";
import Reveal from "./Reveal";

const STATS = [
  { value: 7, suffix: "+", label: "years shipping production software" },
  { value: 2, suffix: "", label: "AI products designed, built and run end to end" },
  { value: 31, suffix: "", label: "engineers on one team, scaled from 6" },
  { value: 24, suffix: "/7", label: "my products run, unattended" },
];

/** Four solid accent-coloured stat boxes with black type, matching the engagement steps above. */
export default function StatsBand() {
  return (
    <Reveal variant="fade" stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {STATS.map((s, i) => (
        <div
          key={s.label}
          className="rounded-2xl bg-brand-500 p-6 text-black transition-colors duration-300 hover:bg-brand-400 sm:p-8"
          style={{ "--i": i } as CSSProperties}
        >
          <p className="display text-5xl text-black sm:text-6xl">
            <CountUp value={s.value} suffix={s.suffix} />
          </p>
          <p className="label mt-3 text-black/70">{s.label}</p>
        </div>
      ))}
    </Reveal>
  );
}
