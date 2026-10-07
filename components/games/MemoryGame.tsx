"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { TOOLS } from "@/lib/tools";
import { Sfx } from "./sfx";

/** MATCH THE STACK: flip cards, pair the tools behind Flows and Agent Studio. Fewest moves wins. */
const BEST_KEY = "memory-best";
const PAIRS = 8;
type Card = { key: number; tool: (typeof TOOLS)[number]; up: boolean; done: boolean };
const readBest = () => { try { return Number(localStorage.getItem(BEST_KEY) ?? 0) || 0; } catch { return 0; } };

function deal(): Card[] {
  const pool = TOOLS.filter((t) => !t.app).slice();
  for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
  const picked = pool.slice(0, PAIRS);
  const cards = [...picked, ...picked].map((tool, i) => ({ key: i, tool, up: false, done: false }));
  for (let i = cards.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [cards[i], cards[j]] = [cards[j], cards[i]]; }
  return cards;
}

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[] | null>(null);
  const [moves, setMoves] = useState(0);
  const [best, setBest] = useState<number | null>(null);
  const [lock, setLock] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const sfx = useRef(new Sfx());
  const timer = useRef(0);
  const done = useMemo(() => !!cards && cards.every((c) => c.done), [cards]);

  useEffect(() => {
    if (!cards || done) { clearInterval(timer.current); return; }
    timer.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer.current);
  }, [cards, done]);

  const start = () => { sfx.current.init(); setCards(deal()); setMoves(0); setSeconds(0); setLock(false); setBest(readBest() || null); };

  const flip = (i: number) => {
    if (!cards || lock) return;
    const c = cards[i];
    if (c.up || c.done) return;
    const next = cards.map((x, j) => (j === i ? { ...x, up: true } : x));
    setCards(next); sfx.current.shot();
    const up = next.filter((x) => x.up && !x.done);
    if (up.length === 2) {
      setMoves((m) => m + 1); setLock(true);
      const match = up[0].tool.id === up[1].tool.id;
      const movesNow = moves + 1;
      window.setTimeout(() => {
        setCards((cur) => {
          const after = (cur ?? []).map((x) => (x.up && !x.done ? (match ? { ...x, done: true } : { ...x, up: false }) : x));
          if (match && after.every((x) => x.done)) {
            // the board is complete: record the best move count
            const nb = readBest(); const b = nb ? Math.min(nb, movesNow) : movesNow;
            try { localStorage.setItem(BEST_KEY, String(b)); } catch {}
            setBest(b); sfx.current.wave();
          }
          return after;
        });
        setLock(false);
        if (match) sfx.current.pass(); else sfx.current.oops();
      }, match ? 350 : 750);
    }
  };

  return (
    <div className="game-bezel relative overflow-clip rounded-2xl">
      <div className="relative min-h-[26rem] overflow-clip rounded-t-2xl bg-[#0b0b0c] p-4 sm:p-6">
        <div aria-hidden="true" className="game-scan pointer-events-none absolute inset-0" />
        <div className="relative mb-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-white/50">
          <span>Moves <span className="text-white">{String(moves).padStart(2, "0")}</span></span>
          <span>Time <span className="text-white">{Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}</span></span>
          <span>Pairs <span className="text-white">{(cards ?? []).filter((c) => c.done).length / 2}/{PAIRS}</span></span>
        </div>
        {cards && (
          <div className="relative grid grid-cols-4 gap-2 sm:gap-3" role="group" aria-label="Memory cards">
            {cards.map((c, i) => (
              <button
                key={c.key}
                type="button"
                onClick={() => flip(i)}
                disabled={c.done}
                aria-label={c.up || c.done ? c.tool.name : "Face-down card"}
                className={`mem-card relative aspect-square ${c.up || c.done ? "is-up" : ""} ${c.done ? "is-done" : ""}`}
                style={{ "--c": c.tool.color } as React.CSSProperties}
              >
                <span className="mem-face mem-back rounded-lg border border-white/15 bg-[#161616]"><span className="label text-white/30">?</span></span>
                <span className="mem-face mem-front rounded-lg border bg-[#121212] p-3">
                  <span className="block h-8 w-8 sm:h-10 sm:w-10">{c.tool.icon}</span>
                  <span className="mt-1 block truncate font-mono text-[9px] uppercase tracking-[0.12em] text-white/70">{c.tool.name}</span>
                </span>
              </button>
            ))}
          </div>
        )}
        {(!cards || done) && (
          <div className="game-title absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0b0b0c]/80 p-6 text-center">
            <p className="label text-brand-400">{!cards ? "Arcade · 03" : "Stack matched"}</p>
            <h3 className="game-glitch display mt-3 text-5xl text-white sm:text-7xl" data-text={!cards ? "MATCH THE STACK" : "ALL PAIRED"}>{!cards ? "Match the stack" : "All paired"}</h3>
            {!cards ? (
              <p className="mt-4 max-w-sm text-sm leading-6 text-neutral-300">Sixteen cards, eight tools from behind Flows and Agent Studio. Pair them in as few moves as you can.</p>
            ) : (
              <p className="label mt-3 text-neutral-500">{moves} moves · {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}{best !== null && moves <= best ? " · best so far" : best ? ` · best ${best}` : ""}</p>
            )}
            <button type="button" onClick={start} className="btn btn--solid game-blink mt-7 text-sm"><span className="btn-ico">▶</span><span>{!cards ? "Press start" : "Deal again"}</span></button>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between border-t hairline px-4 py-2"><span className="label text-neutral-500">Nishy Arcade · 03</span><span className="label text-neutral-500">Fewest moves wins</span></div>
    </div>
  );
}
