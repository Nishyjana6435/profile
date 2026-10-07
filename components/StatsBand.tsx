import type { CSSProperties } from "react";
import CountUp from "./CountUp";
import Reveal from "./Reveal";

const STATS = [
  { value: 7, suffix: "+", label: "years shipping production software" },
  { value: 2, suffix: "", label: "AI products designed, built and run end to end" },
  { value: 31, suffix: "", label: "engineers on one team, scaled from 6" },
  { value: 24, suffix: "/7", label: "my products run, unattended" },
];

export default function StatsBand() {
  return (
    <Reveal variant="fade" stagger className="grid overflow-clip rounded-2xl border hairline sm:grid-cols-2 lg:grid-cols-4">
      {STATS.map((s, i) => (
        <div key={s.label} className="border-b hairline p-6 sm:border-b-0 sm:border-r sm:last:border-r-0 sm:p-8" style={{ "--i": i } as CSSProperties}>
          <p className="display text-5xl text-white sm:text-6xl">
            <CountUp value={s.value} suffix={s.suffix} />
          </p>
          <p className="label mt-3 text-neutral-400">{s.label}</p>
        </div>
      ))}
    </Reveal>
  );
}
