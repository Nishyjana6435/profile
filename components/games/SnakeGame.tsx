"use client";

import { useEffect, useRef, useState } from "react";
import { Sfx } from "./sfx";
import { reducedMotion } from "@/lib/a11y";

/**
 * WORKFLOW SNAKE: the snake is a workflow; every step you eat is appended.
 * Walls and your own tail end the run. Arrows, WASD, swipe, or the d-pad.
 */
const COLS = 24, ROWS = 16, BEST_KEY = "snake-best";
const STEPS = ["Trigger", "Fetch", "Summarise", "Slack", "Sheet", "Email", "Approve", "Deploy", "Retry", "Log"];
type Pt = { x: number; y: number };
type Phase = "idle" | "playing" | "done";
const readBest = () => { try { return Number(localStorage.getItem(BEST_KEY) ?? 0) || 0; } catch { return 0; } };

export default function SnakeGame() {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const wrap = useRef<HTMLDivElement | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [steps, setSteps] = useState(0);
  const [best, setBest] = useState<number | null>(null);
  const [muted, setMuted] = useState(false);
  const sfx = useRef(new Sfx());
  const g = useRef({
    snake: [] as Pt[], dir: { x: 1, y: 0 } as Pt, next: { x: 1, y: 0 } as Pt, food: { x: 5, y: 5 } as Pt, foodLabel: "Trigger",
    score: 0, speed: 150, acc: 0, last: 0, raf: 0, phase: "idle" as Phase, pops: [] as { x: number; y: number; t: string; life: number }[],
    flash: 0, w: 0, h: 0, accent: "#3b82f6", accentRgb: "59 130 246", touch: null as Pt | null,
  });

  const spawnFood = () => {
    const s = g.current;
    let p: Pt;
    do { p = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) }; } while (s.snake.some((q) => q.x === p.x && q.y === p.y));
    s.food = p; s.foodLabel = STEPS[Math.floor(Math.random() * STEPS.length)];
  };
  const start = () => {
    const s = g.current;
    sfx.current.init();
    s.snake = [{ x: 8, y: 8 }, { x: 7, y: 8 }, { x: 6, y: 8 }];
    s.dir = { x: 1, y: 0 }; s.next = { x: 1, y: 0 }; s.score = 0; s.speed = 150; s.acc = 0; s.pops = []; s.phase = "playing";
    spawnFood();
    setBest(readBest()); setScore(0); setSteps(0); setPhase("playing");
    canvas.current?.focus();
  };
  const turn = (d: Pt) => {
    const s = g.current;
    if (d.x === -s.dir.x && d.y === -s.dir.y) return; // no reversing
    s.next = d;
  };

  useEffect(() => {
    const cv = canvas.current, el = wrap.current;
    if (!cv || !el) return;
    const s = g.current;
    const cs = getComputedStyle(document.documentElement);
    s.accent = cs.getPropertyValue("--accent-500").trim() || s.accent;
    s.accentRgb = cs.getPropertyValue("--accent-500-rgb").trim() || s.accentRgb;
    const ctx = cv.getContext("2d")!;
    const resize = () => {
      const r = el.getBoundingClientRect(); const dpr = Math.min(2, window.devicePixelRatio || 1);
      s.w = r.width; s.h = r.height; cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(el);

    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Pt> = { ArrowUp: { x: 0, y: -1 }, w: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 }, s: { x: 0, y: 1 }, ArrowLeft: { x: -1, y: 0 }, a: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 }, d: { x: 1, y: 0 } };
      if (map[e.key]) { e.preventDefault(); turn(map[e.key]); }
    };
    const onDown = (e: PointerEvent) => { s.touch = { x: e.clientX, y: e.clientY }; };
    const onUp = (e: PointerEvent) => {
      if (!s.touch) return;
      const dx = e.clientX - s.touch.x, dy = e.clientY - s.touch.y; s.touch = null;
      if (Math.abs(dx) + Math.abs(dy) < 18) return;
      turn(Math.abs(dx) > Math.abs(dy) ? { x: Math.sign(dx), y: 0 } : { x: 0, y: Math.sign(dy) });
    };
    cv.addEventListener("keydown", onKey); cv.addEventListener("pointerdown", onDown); window.addEventListener("pointerup", onUp);

    const finish = () => {
      s.phase = "done"; setPhase("done");
      const nb = Math.max(readBest(), s.score); try { localStorage.setItem(BEST_KEY, String(nb)); } catch {}
      setBest(nb); sfx.current.boom(); s.flash = 1;
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - s.last) / 1000); s.last = now;
      const cell = Math.min(s.w / COLS, s.h / ROWS);
      const ox = (s.w - cell * COLS) / 2, oy = (s.h - cell * ROWS) / 2;
      if (s.phase === "playing") {
        s.acc += dt * 1000;
        while (s.acc >= s.speed) {
          s.acc -= s.speed;
          s.dir = s.next;
          const head = { x: s.snake[0].x + s.dir.x, y: s.snake[0].y + s.dir.y };
          if (head.x < 0 || head.y < 0 || head.x >= COLS || head.y >= ROWS || s.snake.some((q) => q.x === head.x && q.y === head.y)) { finish(); break; }
          s.snake.unshift(head);
          if (head.x === s.food.x && head.y === s.food.y) {
            s.score += 10; setScore(s.score); setSteps(s.snake.length - 3); s.speed = Math.max(70, s.speed - 4);
            s.pops.push({ x: ox + (head.x + 0.5) * cell, y: oy + head.y * cell, t: `+ ${s.foodLabel}`, life: 1 });
            sfx.current.pass(); spawnFood();
          } else s.snake.pop();
        }
      }
      for (const p of s.pops) p.life -= dt * 1.3;
      s.pops = s.pops.filter((p) => p.life > 0);
      s.flash = Math.max(0, s.flash - dt * 2);

      // draw
      ctx.clearRect(0, 0, s.w, s.h);
      ctx.fillStyle = "#0b0b0c"; ctx.fillRect(0, 0, s.w, s.h);
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      for (let x = 0; x <= COLS; x++) for (let y = 0; y <= ROWS; y++) ctx.fillRect(ox + x * cell - 0.5, oy + y * cell - 0.5, 1, 1);
      ctx.strokeStyle = `rgb(${s.accentRgb} / 0.35)`; ctx.lineWidth = 1; ctx.strokeRect(ox + 0.5, oy + 0.5, cell * COLS - 1, cell * ROWS - 1);
      // food
      const fx = ox + s.food.x * cell, fy = oy + s.food.y * cell, pulse = 0.78 + Math.sin(now / 180) * 0.08;
      ctx.save(); ctx.shadowColor = "#fff"; ctx.shadowBlur = 12; ctx.fillStyle = "#fff";
      ctx.fillRect(fx + cell * (1 - pulse) / 2, fy + cell * (1 - pulse) / 2, cell * pulse, cell * pulse); ctx.restore();
      ctx.fillStyle = "rgba(255,255,255,0.7)"; ctx.font = "600 10px var(--font-geist-mono), monospace"; ctx.textAlign = "center"; ctx.fillText(s.foodLabel.toUpperCase(), fx + cell / 2, fy - 5);
      // snake
      s.snake.forEach((q, i) => {
        const t = 1 - i / Math.max(1, s.snake.length);
        ctx.save(); if (i === 0) { ctx.shadowColor = s.accent; ctx.shadowBlur = 14; }
        ctx.fillStyle = i === 0 ? s.accent : `rgb(${s.accentRgb} / ${0.35 + t * 0.6})`;
        const pad = i === 0 ? 1 : 2;
        ctx.beginPath(); ctx.roundRect(ox + q.x * cell + pad, oy + q.y * cell + pad, cell - pad * 2, cell - pad * 2, 3); ctx.fill(); ctx.restore();
        if (i === 0) { ctx.fillStyle = "#0b0b0c"; const ex = ox + q.x * cell + cell / 2 + s.dir.x * cell * 0.18, ey = oy + q.y * cell + cell / 2 + s.dir.y * cell * 0.18; ctx.fillRect(ex - 2, ey - 2, 4, 4); }
      });
      // pops + flash
      for (const p of s.pops) { ctx.globalAlpha = Math.max(0, p.life); ctx.fillStyle = "#fff"; ctx.font = "700 12px var(--font-geist-mono), monospace"; ctx.textAlign = "center"; ctx.fillText(p.t, p.x, p.y - (1 - p.life) * 24); }
      ctx.globalAlpha = 1;
      if (s.flash > 0) { ctx.fillStyle = `rgba(255,61,90,${s.flash * 0.25})`; ctx.fillRect(0, 0, s.w, s.h); }
      s.raf = requestAnimationFrame(frame);
    };
    s.last = performance.now(); s.raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(s.raf); ro.disconnect(); cv.removeEventListener("keydown", onKey); cv.removeEventListener("pointerdown", onDown); window.removeEventListener("pointerup", onUp); };
  }, []);

  return (
    <div className="game-bezel relative overflow-clip rounded-2xl">
      <div ref={wrap} className="relative aspect-[4/5] w-full overflow-clip rounded-t-2xl bg-[#0b0b0c] touch-none sm:aspect-[16/9]">
        <canvas ref={canvas} tabIndex={0} aria-label="Workflow Snake, an arcade game" className="block h-full w-full outline-none" />
        <div aria-hidden="true" className="game-scan pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute left-4 top-3 font-mono text-[10px] uppercase tracking-[0.16em] text-white/50">
          Score <span className="text-white">{String(score).padStart(4, "0")}</span> · Steps <span className="text-white">{steps}</span>
        </div>
        <button type="button" onClick={() => { sfx.current.muted = !muted; setMuted(!muted); }} className="label absolute bottom-3 left-3 z-10 rounded-md border border-white/15 bg-[#121212]/80 px-2.5 py-1.5 text-white/70 hover:text-white" aria-pressed={muted}>
          {muted ? "Sound off" : "Sound on"}
        </button>
        {/* d-pad for touch */}
        {phase === "playing" && (
          <div className="absolute bottom-3 right-3 z-10 grid grid-cols-3 gap-1 sm:hidden" aria-label="Direction pad">
            {[["", { x: 0, y: -1 }, ""], [{ x: -1, y: 0 }, "", { x: 1, y: 0 }], ["", { x: 0, y: 1 }, ""]].flat().map((d, i) =>
              d ? <button key={i} type="button" onPointerDown={() => turn(d as Pt)} className="h-10 w-10 rounded-md border border-white/20 bg-[#121212]/80 text-white" aria-label="Turn">·</button> : <span key={i} />,
            )}
          </div>
        )}
        {phase !== "playing" && (
          <div className="game-title absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0b0b0c]/75 p-6 text-center">
            <p className="label text-brand-400">{phase === "idle" ? "Arcade · 02" : "Run ended"}</p>
            <h3 className="game-glitch display mt-3 text-5xl text-white sm:text-7xl" data-text={phase === "idle" ? "WORKFLOW SNAKE" : "RUN ENDED"}>{phase === "idle" ? "Workflow Snake" : "Run ended"}</h3>
            {phase === "idle" ? (
              <p className="mt-4 max-w-sm text-sm leading-6 text-neutral-300">Eat steps to grow the workflow. Walls and your own tail end the run. Arrows, WASD or swipe.</p>
            ) : (
              <>
                <p className="display mt-3 text-6xl text-white tabular-nums">{String(score).padStart(4, "0")}</p>
                <p className="label mt-2 text-neutral-500">{steps} steps{best !== null && score >= best && score > 0 ? " · new high score" : best ? ` · high score ${best}` : ""}</p>
              </>
            )}
            <button type="button" onClick={start} className={`btn btn--solid mt-7 text-sm ${reducedMotion() ? "" : "game-blink"}`}><span className="btn-ico">▶</span><span>{phase === "idle" ? "Press start" : "Play again"}</span></button>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between border-t hairline px-4 py-2"><span className="label text-neutral-500">Nishy Arcade · 02</span><span className="label text-neutral-500">Speed rises with every step</span></div>
    </div>
  );
}
