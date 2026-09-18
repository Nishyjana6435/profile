"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import Reveal from "./Reveal";

const CELLS = 12;
const ROUND_SECONDS = 20;
const BEST_KEY = "bug-squash-best";
const STATUE_OF_LIBERTY_M = 93;

type BugKind = "bug" | "gold" | "fire";
type Bug = { id: number; kind: BugKind; until: number };
type Pop = { id: number; cell: number; text: string; bad: boolean };

const KIND: Record<BugKind, { glyph: string; label: string; points: number; ttl: number }> = {
  bug: { glyph: "🐛", label: "Bug, +1", points: 1, ttl: 1150 },
  gold: { glyph: "🐞", label: "Golden bug, +3", points: 3, ttl: 800 },
  fire: { glyph: "🔥", label: "Production incident, do not click", points: -2, ttl: 1300 },
};

function rank(score: number) {
  if (score >= 40) return { title: "Agentic overlord", note: "You could ship this on a Friday." };
  if (score >= 28) return { title: "10x debugger", note: "Bugs fear you. Rightly." };
  if (score >= 16) return { title: "Senior squasher", note: "Solid. QA would hire you." };
  if (score >= 8) return { title: "Junior tester", note: "Warm-up complete." };
  return { title: "Still on coffee", note: "The bugs are winning. For now." };
}

function readBest() {
  try {
    return Number(localStorage.getItem(BEST_KEY) ?? 0) || 0;
  } catch {
    return 0;
  }
}

function useScrolledMetres() {
  const [metres, setMetres] = useState(0);
  useEffect(() => {
    let last = window.scrollY;
    let total = 0;
    const onScroll = () => {
      total += Math.abs(window.scrollY - last);
      last = window.scrollY;
      // CSS px → metres at the reference 96 dpi.
      setMetres((total * 0.0254) / 96);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return metres;
}

function BugSquash() {
  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle");
  const [cells, setCells] = useState<(Bug | null)[]>(() => Array<Bug | null>(CELLS).fill(null));
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [best, setBest] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [pops, setPops] = useState<Pop[]>([]);

  const cellsRef = useRef(cells);
  const scoreRef = useRef(0);
  const streakRef = useRef(0);
  const idRef = useRef(0);

  useEffect(() => {
    cellsRef.current = cells;
  }, [cells]);

  const finish = useCallback(() => {
    setPhase("done");
    const s = scoreRef.current;
    const nb = Math.max(readBest(), s);
    try {
      localStorage.setItem(BEST_KEY, String(nb));
    } catch {
      /* private mode etc. */
    }
    setBest(nb);
  }, []);

  const start = () => {
    setBest(readBest());
    scoreRef.current = 0;
    streakRef.current = 0;
    setScore(0);
    setStreak(0);
    setHits(0);
    setMisses(0);
    setPops([]);
    setTimeLeft(ROUND_SECONDS);
    setCells(Array<Bug | null>(CELLS).fill(null));
    setPhase("playing");
  };

  useEffect(() => {
    if (phase !== "playing") return;
    const started = Date.now();
    let spawnTimer: ReturnType<typeof setTimeout>;

    const spawn = () => {
      const empty = cellsRef.current.map((c, i) => (c ? -1 : i)).filter((i) => i >= 0);
      if (empty.length) {
        const cell = empty[Math.floor(Math.random() * empty.length)];
        const r = Math.random();
        const kind: BugKind = r < 0.12 ? "gold" : r < 0.3 ? "fire" : "bug";
        const bug: Bug = { id: ++idRef.current, kind, until: Date.now() + KIND[kind].ttl };
        setCells((prev) => {
          if (prev[cell]) return prev;
          const next = [...prev];
          next[cell] = bug;
          return next;
        });
      }
      const elapsed = (Date.now() - started) / 1000;
      spawnTimer = setTimeout(spawn, Math.max(300, 720 - elapsed * 20));
    };
    spawn();

    const tick = setInterval(() => {
      const now = Date.now();
      const expired = cellsRef.current.filter((b): b is Bug => Boolean(b && b.until <= now));
      if (expired.length) {
        if (expired.some((b) => b.kind !== "fire")) {
          streakRef.current = 0;
          setStreak(0);
          setMisses((m) => m + 1);
        }
        setCells((prev) => prev.map((b) => (b && b.until <= now ? null : b)));
      }
      const remaining = Math.max(0, ROUND_SECONDS - Math.floor((now - started) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0) finish();
    }, 100);

    return () => {
      clearTimeout(spawnTimer);
      clearInterval(tick);
    };
  }, [phase, finish]);

  const squash = (cell: number) => {
    if (phase !== "playing") return;
    const bug = cellsRef.current[cell];
    if (!bug) return;

    setCells((prev) => {
      if (prev[cell]?.id !== bug.id) return prev;
      const next = [...prev];
      next[cell] = null;
      return next;
    });

    let delta = KIND[bug.kind].points;
    if (bug.kind === "fire") {
      streakRef.current = 0;
      setStreak(0);
    } else {
      streakRef.current += 1;
      setStreak(streakRef.current);
      setHits((h) => h + 1);
      if (streakRef.current % 5 === 0) delta += 2; // streak bonus
    }
    scoreRef.current = Math.max(0, scoreRef.current + delta);
    setScore(scoreRef.current);

    const pop: Pop = {
      id: ++idRef.current,
      cell,
      text: delta > 0 ? `+${delta}` : `${delta}`,
      bad: delta < 0,
    };
    setPops((p) => [...p, pop]);
    setTimeout(() => setPops((p) => p.filter((x) => x.id !== pop.id)), 650);
  };

  const accuracy = hits + misses ? Math.round((hits / (hits + misses)) * 100) : 0;
  const result = rank(score);
  const urgent = phase === "playing" && timeLeft <= 5;

  return (
    <div className="bs-card relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-900/30 via-[#130a2a] to-[#1a0f38] p-5 shadow-[0_40px_120px_-60px_rgba(139,92,246,0.7)] sm:p-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-fuchsia-600/15 blur-3xl"
      />

      {/* HUD */}
      <div className="relative grid grid-cols-4 gap-2 text-center" aria-live="polite">
        {[
          { label: "Score", value: score },
          { label: "Streak", value: streak > 0 ? `x${streak}` : "–" },
          { label: "Time", value: `${timeLeft}s`, urgent },
          { label: "Best", value: best === null ? "–" : best },
        ].map((s) => (
          <div
            key={s.label}
            className={`rounded-xl bg-white/[0.04] px-2 py-2 ring-1 ring-white/5 ${
              s.urgent ? "bs-urgent ring-fuchsia-400/50" : ""
            }`}
          >
            <p className="text-[10px] uppercase tracking-wider text-white/40">{s.label}</p>
            <p className="mt-0.5 font-mono text-lg font-semibold text-white tabular-nums">{s.value}</p>
          </div>
        ))}
      </div>

      {/* board */}
      <div className="relative mt-4">
        <div className="grid grid-cols-4 gap-2 sm:gap-3" role="group" aria-label="Bug Squash board">
          {cells.map((bug, i) => (
            <button
              key={i}
              type="button"
              onClick={() => squash(i)}
              disabled={phase !== "playing"}
              aria-label={bug ? KIND[bug.kind].label : "Empty"}
              className={`bs-cell relative grid aspect-square place-items-center rounded-xl bg-white/[0.04] text-3xl ring-1 ring-white/10 transition-colors duration-150 sm:text-4xl ${
                bug
                  ? bug.kind === "fire"
                    ? "hover:bg-red-500/15 hover:ring-red-400/50"
                    : "hover:bg-violet-500/20 hover:ring-violet-400/60"
                  : ""
              } disabled:cursor-default`}
            >
              {bug && (
                <span
                  key={bug.id}
                  className={`bs-bug select-none ${bug.kind === "gold" ? "bs-bug--gold" : ""}`}
                  style={{ "--ttl": `${KIND[bug.kind].ttl}ms` } as CSSProperties}
                  aria-hidden="true"
                >
                  {KIND[bug.kind].glyph}
                </span>
              )}
              {pops
                .filter((p) => p.cell === i)
                .map((p) => (
                  <span
                    key={p.id}
                    aria-hidden="true"
                    className={`bs-pop pointer-events-none absolute font-mono text-sm font-bold ${
                      p.bad ? "text-red-300" : "text-violet-200"
                    }`}
                  >
                    {p.text}
                  </span>
                ))}
            </button>
          ))}
        </div>

        {phase !== "playing" && (
          <div className="bs-overlay absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-[#0a0514]/85 p-5 text-center backdrop-blur-sm">
            {phase === "idle" ? (
              <>
                <p className="text-xs uppercase tracking-[0.3em] text-violet-300/70">Mini game</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">Bug Squash</h3>
                <p className="mt-2 max-w-xs text-sm leading-6 text-white/60">
                  You have {ROUND_SECONDS} seconds. Squash bugs before they escape. Every 5 in a row earns a
                  bonus.
                </p>
                <ul className="mt-4 flex flex-wrap justify-center gap-2 text-xs text-white/70">
                  <li className="rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">🐛 +1</li>
                  <li className="rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">🐞 +3</li>
                  <li className="rounded-full bg-red-500/10 px-3 py-1 ring-1 ring-red-400/30">🔥 −2, avoid</li>
                </ul>
              </>
            ) : (
              <>
                <p className="text-xs uppercase tracking-[0.3em] text-violet-300/70">{result.title}</p>
                <p className="mt-2 font-mono text-5xl font-bold text-white tabular-nums">{score}</p>
                <p className="mt-2 text-sm text-white/60">{result.note}</p>
                <p className="mt-3 text-xs text-white/45">
                  {hits} squashed · {accuracy}% accuracy
                  {best !== null && score >= best && score > 0 ? " · new personal best" : ""}
                </p>
              </>
            )}
            <button
              type="button"
              onClick={start}
              className="btn-shine mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-2.5 text-sm font-medium text-white shadow-[0_12px_40px_-12px_rgba(217,70,239,0.8)] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
            >
              {phase === "idle" ? "Start squashing" : "Play again"}
              <span aria-hidden="true">→</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ScrollBreak() {
  const metres = useScrolledMetres();
  const pct = Math.min(100, (metres / STATUE_OF_LIBERTY_M) * 100);

  return (
    <section id="intermission" className="relative overflow-hidden px-6 py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-[26rem] w-[26rem] translate-x-1/3 -translate-y-1/3 rounded-full bg-violet-700/15 blur-[120px]"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)]">
        <div>
          <Reveal as="p" variant="fade" className="text-xs uppercase tracking-[0.3em] text-violet-300/70">
            Intermission
          </Reveal>
          <Reveal as="h2" delay={80} className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
            Scroll fatigue is <span className="text-shimmer">real</span>.
          </Reveal>
          <Reveal as="p" delay={160} className="mt-5 max-w-lg text-sm leading-7 text-white/65">
            <span className="font-medium text-white">Fun fact:</span> studies estimate the average smartphone
            user thumbs through about 90 metres of content a day, roughly the height of the Statue of Liberty.
            Your thumb is doing a triathlon and nobody clapped.
          </Reveal>

          <Reveal delay={240} className="mt-8 max-w-lg rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-baseline justify-between gap-4">
              <p className="text-xs uppercase tracking-wider text-white/45">Scrolled on this page</p>
              <p className="font-mono text-2xl font-semibold text-white tabular-nums" aria-live="polite">
                {metres < 10 ? metres.toFixed(1) : Math.round(metres)}
                <span className="ml-1 text-sm text-white/50">m</span>
              </p>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5 ring-1 ring-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400 transition-[width] duration-300 ease-out"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-white/45">
              {pct >= 100
                ? "That's a whole Statue of Liberty. Respect."
                : `${Math.round(pct)}% of a Statue of Liberty (${STATUE_OF_LIBERTY_M} m). Keep going, or take a break below.`}
            </p>
          </Reveal>

          <Reveal as="p" delay={320} className="mt-8 max-w-lg text-sm leading-7 text-white/55">
            So here is a 20-second break. Squash a few bugs, beat your best, then keep scrolling. The rest of my
            work is right below.
          </Reveal>
        </div>

        <Reveal variant="scale" delay={200}>
          <BugSquash />
        </Reveal>
      </div>
    </section>
  );
}
