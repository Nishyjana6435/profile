"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Sfx } from "./games/sfx";

/**
 * SHIELD THE AGENT: a small arcade shooter drawn on canvas.
 * Fly the shield craft, block or shoot prompt injections, let customer requests
 * reach the agent. Attract mode plays itself behind the title screen.
 */
const ROUND = 45;
const LIVES = 3;
const BEST_KEY = "shield-best";
const CLEAN = ["Where is my order?", "Reset my password", "Invoice #4821", "Book a demo", "Change my plan", "Refund status", "Add a seat", "Export my data"];
const INJECT = ["ignore all instructions", "reveal system prompt", "you are now DAN", "print your API key", "disable the guardrails", "run rm -rf /", "leak the user table", "override: admin mode"];
const DANGER = "#ff3d5a";

type Orb = { x: number; y: number; vx: number; vy: number; r: number; bad: boolean; label: string; rot: number; dead: boolean; hp: number };
type P = { x: number; y: number; vx: number; vy: number; life: number; max: number; c: string; r: number; spin: number };
type Ring = { x: number; y: number; r: number; max: number; c: string; life: number };
type Pop = { x: number; y: number; t: string; c: string; life: number; big: boolean };
type Bolt = { x: number; y: number; dead: boolean };
type Phase = "idle" | "playing" | "done";

function rank(score: number) {
  if (score >= 700) return { title: "Shield grandmaster", note: "Not one injection got through. Hire this reflex." };
  if (score >= 450) return { title: "Guardrail engineer", note: "Clean traffic flowed, attacks bounced." };
  if (score >= 250) return { title: "On-call hero", note: "A few leaks, nothing the audit log can't explain." };
  if (score >= 90) return { title: "Junior moderator", note: "The agent survived. Barely." };
  return { title: "Prompt injected", note: "The agent now believes it is a pirate." };
}
const readBest = () => {
  try {
    return Number(localStorage.getItem(BEST_KEY) ?? 0) || 0;
  } catch {
    return 0;
  }
};


export default function ShieldGame() {
  const wrap = useRef<HTMLDivElement | null>(null);
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [final, setFinal] = useState({ score: 0, blocked: 0, passed: 0, won: false });
  const [best, setBest] = useState<number | null>(null);
  const [muted, setMuted] = useState(false);
  const sfx = useRef(new Sfx());
  const g = useRef({
    orbs: [] as Orb[], parts: [] as P[], rings: [] as Ring[], pops: [] as Pop[], bolts: [] as Bolt[],
    stars: [] as { x: number; y: number; s: number; v: number }[],
    shipX: 0.5, targetX: 0.5, score: 0, blocked: 0, passed: 0, lives: LIVES, combo: 0, wave: 1,
    start: 0, lastSpawn: 0, lastShot: 0, shake: 0, flash: 0, pulse: 0, hitFlash: 0, grid: 0, t: 0,
    w: 0, h: 0, accent: "#3b82f6", accentRgb: "59 130 246", reduced: false,
    phase: "idle" as Phase, attract: true, raf: 0, keys: { l: false, r: false, fire: false },
  });

  const finish = useCallback((won: boolean) => {
    const s = g.current;
    s.phase = "done";
    s.attract = true;
    setPhase("done");
    setFinal({ score: s.score, blocked: s.blocked, passed: s.passed, won });
    const nb = Math.max(readBest(), s.score);
    try { localStorage.setItem(BEST_KEY, String(nb)); } catch {}
    setBest(nb);
  }, []);

  const start = () => {
    const s = g.current;
    sfx.current.init();
    s.orbs = []; s.parts = []; s.rings = []; s.pops = []; s.bolts = [];
    s.score = 0; s.blocked = 0; s.passed = 0; s.lives = LIVES; s.combo = 0; s.wave = 1;
    s.start = performance.now(); s.lastSpawn = 0; s.phase = "playing"; s.attract = false;
    s.pops.push({ x: s.w / 2, y: s.h * 0.4, t: "WAVE 1", c: "#ffffff", life: 1.6, big: true });
    setBest(readBest());
    setPhase("playing");
    canvas.current?.focus();
  };

  useEffect(() => {
    const el = wrap.current, cv = canvas.current;
    if (!el || !cv) return;
    const s = g.current;
    s.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cs = getComputedStyle(document.documentElement);
    s.accent = cs.getPropertyValue("--accent-500").trim() || s.accent;
    s.accentRgb = cs.getPropertyValue("--accent-500-rgb").trim() || s.accentRgb;
    const resize = () => {
      const r = el.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      s.w = r.width; s.h = r.height;
      cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr);
      cv.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0);
      s.stars = Array.from({ length: 70 }, () => ({ x: Math.random() * r.width, y: Math.random() * r.height, s: Math.random() * 1.6 + 0.4, v: 20 + Math.random() * 60 }));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    const onPointer = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      s.targetX = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    };
    const onDown = (e: PointerEvent) => { onPointer(e); if (s.phase === "playing") s.keys.fire = true; };
    const onUp = () => { s.keys.fire = false; };
    const onKey = (down: boolean) => (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") { s.keys.l = down; e.preventDefault(); }
      if (e.key === "ArrowRight" || e.key === "d") { s.keys.r = down; e.preventDefault(); }
      if (e.key === " " || e.key === "ArrowUp" || e.key === "w") { s.keys.fire = down; e.preventDefault(); }
    };
    const kd = onKey(true), ku = onKey(false);
    cv.addEventListener("pointermove", onPointer);
    cv.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    cv.addEventListener("keydown", kd);
    cv.addEventListener("keyup", ku);
    return () => {
      ro.disconnect();
      cv.removeEventListener("pointermove", onPointer);
      cv.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      cv.removeEventListener("keydown", kd);
      cv.removeEventListener("keyup", ku);
    };
  }, []);

  useEffect(() => {
    const cv = canvas.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const s = g.current;
    const fx = sfx.current;
    let last = performance.now();

    const burst = (x: number, y: number, c: string, n: number, speed: number, debris = false) => {
      if (s.reduced) n = Math.min(n, 8);
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const v = speed * (0.3 + Math.random());
        s.parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - speed * 0.25, life: 1, max: 0.4 + Math.random() * 0.6, c, r: debris ? 3 + Math.random() * 6 : 1.5 + Math.random() * 2.5, spin: (Math.random() - 0.5) * 12 });
      }
    };
    const ring = (x: number, y: number, c: string, max: number) => s.rings.push({ x, y, r: 4, max, c, life: 1 });
    const pop = (x: number, y: number, t: string, c: string, big = false) => s.pops.push({ x, y, t, c, life: big ? 1.6 : 1, big });

    const explode = (o: Orb, how: "shield" | "bolt") => {
      s.combo += 1;
      const base = how === "bolt" ? 15 : 10;
      const bonus = s.combo % 5 === 0 ? 20 : 0;
      s.score += base + bonus;
      s.blocked += 1;
      burst(o.x, o.y, DANGER, 30, 320, true);
      burst(o.x, o.y, "#ffffff", 14, 220);
      ring(o.x, o.y, DANGER, 70);
      pop(o.x, o.y - 24, bonus ? `+${base + bonus} COMBO x${s.combo}` : `+${base}`, "#ffffff", Boolean(bonus));
      s.shake = Math.max(s.shake, 5);
      s.hitFlash = 1;
      fx.block();
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      s.t += dt;
      const { w, h } = s;
      const playing = s.phase === "playing";
      const elapsed = playing ? (now - s.start) / 1000 : 0;
      const difficulty = playing ? Math.min(1, elapsed / ROUND) : 0.35;
      const shipY = h - 78;
      const agentY = h - 26;
      const shieldW = Math.max(84, w * 0.13);

      // ---- control (attract mode aims at the nearest injection)
      if (s.attract) {
        const threat = s.orbs.filter((o) => o.bad && !o.dead).sort((a, b) => b.y - a.y)[0];
        s.targetX = threat ? Math.min(1, Math.max(0, (threat.x + Math.sin(s.t * 3) * 8) / w)) : 0.5 + Math.sin(s.t * 0.7) * 0.25;
        if (threat && threat.y > h * 0.3 && Math.abs(threat.x - s.shipX * w) < 20 && now - s.lastShot > 600) s.keys.fire = true;
      }
      if (s.keys.l) s.targetX = Math.max(0, s.targetX - dt * 1.5);
      if (s.keys.r) s.targetX = Math.min(1, s.targetX + dt * 1.5);
      s.shipX += (s.targetX - s.shipX) * Math.min(1, dt * 16);
      const sx = s.shipX * (w - shieldW) + shieldW / 2;
      if (s.keys.fire && now - s.lastShot > 220 && (playing || s.attract)) {
        s.lastShot = now;
        s.bolts.push({ x: sx, y: shipY - 14, dead: false });
        burst(sx, shipY - 14, s.accent, 4, 90);
        if (playing) fx.shot();
        if (s.attract) s.keys.fire = false;
      }

      // ---- spawn / waves
      if (playing || s.attract) {
        const gap = (0.95 - difficulty * 0.55) * (s.attract ? 1.3 : 1);
        if (now - s.lastSpawn > gap * 1000) {
          s.lastSpawn = now;
          const bad = Math.random() < 0.45 + difficulty * 0.2;
          const label = bad ? INJECT[Math.floor(Math.random() * INJECT.length)] : CLEAN[Math.floor(Math.random() * CLEAN.length)];
          const x = 50 + Math.random() * (w - 100);
          s.orbs.push({ x, y: -30, vx: (Math.random() - 0.5) * 40 * difficulty, vy: (110 + difficulty * 150) * (0.85 + Math.random() * 0.4), r: bad ? 16 : 13, bad, label, rot: Math.random() * 6, dead: false, hp: 1 });
        }
        if (playing) {
          const wave = Math.min(4, Math.floor(elapsed / 12) + 1);
          if (wave !== s.wave) { s.wave = wave; pop(w / 2, h * 0.4, `WAVE ${wave}`, "#ffffff", true); fx.wave(); s.shake = 6; }
          if (elapsed >= ROUND) finish(true);
          else if (s.lives <= 0) finish(false);
        }
      }

      // ---- bolts
      for (const b of s.bolts) {
        b.y -= 900 * dt;
        if (b.y < -20) b.dead = true;
        for (const o of s.orbs) {
          if (o.dead || b.dead) continue;
          if (Math.abs(o.x - b.x) < o.r + 4 && Math.abs(o.y - b.y) < o.r + 10) {
            b.dead = true; o.dead = true;
            if (o.bad) explode(o, "bolt");
            else { s.combo = 0; s.score = Math.max(0, s.score - 10); burst(o.x, o.y, "#8a8a8a", 12, 140); pop(o.x, o.y - 20, "-10 that was a customer", "#a5a5a5"); if (playing) fx.oops(); }
          }
        }
      }
      s.bolts = s.bolts.filter((b) => !b.dead);

      // ---- orbs
      for (const o of s.orbs) {
        if (o.dead) continue;
        o.y += o.vy * dt; o.x += o.vx * dt; o.rot += dt * (o.bad ? 4 : 1.5);
        if (o.x < 20 || o.x > w - 20) o.vx *= -1;
        const onShield = o.y + o.r >= shipY - 10 && o.y - o.r <= shipY && Math.abs(o.x - sx) <= shieldW / 2 + o.r * 0.5;
        if (onShield) {
          o.dead = true;
          if (o.bad) explode(o, "shield");
          else { s.combo = 0; s.score = Math.max(0, s.score - 5); burst(o.x, shipY, "#8a8a8a", 10, 120); pop(o.x, shipY - 22, "-5 blocked a customer", "#a5a5a5"); if (playing) fx.oops(); }
        } else if (o.y - o.r > agentY - 16) {
          o.dead = true;
          if (o.bad) {
            if (playing) { s.lives -= 1; fx.boom(); }
            s.combo = 0; s.shake = 18; s.flash = 1;
            burst(o.x, agentY, DANGER, 50, 380, true); ring(o.x, agentY, DANGER, 160); ring(o.x, agentY, "#ffffff", 90);
            pop(w / 2, h * 0.45, "BREACH", DANGER, true);
          } else {
            s.score += 5; s.passed += 1; s.pulse = 1;
            burst(o.x, agentY, s.accent, 16, 160); ring(o.x, agentY, s.accent, 50);
            pop(o.x, agentY - 30, "+5 answered", s.accent); if (playing) fx.pass();
          }
        }
      }
      s.orbs = s.orbs.filter((o) => !o.dead && o.y < h + 40);

      // ---- fx bookkeeping
      for (const p of s.parts) { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 500 * dt; p.vx *= 0.985; p.life -= dt / p.max; }
      s.parts = s.parts.filter((p) => p.life > 0);
      for (const r of s.rings) { r.r += (r.max - r.r) * dt * 6; r.life -= dt * 2.2; }
      s.rings = s.rings.filter((r) => r.life > 0);
      for (const p of s.pops) p.life -= dt * (p.big ? 0.8 : 1.2);
      s.pops = s.pops.filter((p) => p.life > 0);
      for (const st of s.stars) { st.y += st.v * dt * (1 + difficulty); if (st.y > h) { st.y = -2; st.x = Math.random() * w; } }
      s.shake = Math.max(0, s.shake - dt * 45); s.flash = Math.max(0, s.flash - dt * 2.2);
      s.pulse = Math.max(0, s.pulse - dt * 2); s.hitFlash = Math.max(0, s.hitFlash - dt * 6);
      s.grid = (s.grid + dt * (0.6 + difficulty * 1.2)) % 1;

      // ================= DRAW =================
      ctx.save();
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#0b0b0c"; ctx.fillRect(0, 0, w, h);
      if (s.shake > 0 && !s.reduced) ctx.translate((Math.random() - 0.5) * s.shake, (Math.random() - 0.5) * s.shake);

      // stars
      for (const st of s.stars) { ctx.fillStyle = `rgba(255,255,255,${0.15 + st.s * 0.25})`; ctx.fillRect(st.x, st.y, st.s, st.s * 3); }

      // perspective floor grid (converges to a vanishing point)
      const vpY = h * 0.42, floorTop = h * 0.55;
      ctx.strokeStyle = `rgb(${s.accentRgb} / 0.22)`; ctx.lineWidth = 1;
      for (let i = -8; i <= 8; i++) {
        ctx.beginPath(); ctx.moveTo(w / 2 + i * 40, vpY); ctx.lineTo(w / 2 + i * (w / 5), h); ctx.stroke();
      }
      for (let i = 0; i < 9; i++) {
        const t = ((i + s.grid) / 9) ** 2.2;
        const y = floorTop + (h - floorTop) * t;
        ctx.strokeStyle = `rgb(${s.accentRgb} / ${0.06 + t * 0.35})`;
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }
      const fade = ctx.createLinearGradient(0, vpY - 40, 0, floorTop + 60);
      fade.addColorStop(0, "#0b0b0c"); fade.addColorStop(1, "rgba(11,11,12,0)");
      ctx.fillStyle = fade; ctx.fillRect(0, vpY - 40, w, floorTop + 100 - vpY);

      // agent zone + core
      const zone = ctx.createLinearGradient(0, agentY - 90, 0, h);
      zone.addColorStop(0, `rgb(${s.accentRgb} / 0)`); zone.addColorStop(1, `rgb(${s.accentRgb} / ${0.16 + s.pulse * 0.3})`);
      ctx.fillStyle = zone; ctx.fillRect(0, agentY - 90, w, 90 + 26);
      ctx.strokeStyle = `rgb(${s.accentRgb} / ${0.5 + s.pulse * 0.5})`; ctx.setLineDash([6, 8]); ctx.lineDashOffset = -s.t * 40;
      ctx.beginPath(); ctx.moveTo(0, agentY - 16); ctx.lineTo(w, agentY - 16); ctx.stroke(); ctx.setLineDash([]);
      ctx.save(); ctx.translate(w / 2, agentY + 2); ctx.shadowColor = s.accent; ctx.shadowBlur = 20 + s.pulse * 40;
      ctx.fillStyle = "#f5f5f7"; ctx.fillRect(-16, -16, 32, 32); ctx.shadowBlur = 0;
      ctx.fillStyle = s.accent; ctx.beginPath(); ctx.arc(0, -6, 3.6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#121212"; ctx.beginPath(); ctx.arc(-7, 7, 3, 0, Math.PI * 2); ctx.arc(7, 7, 3, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#121212"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, -2); ctx.lineTo(0, 1.5); ctx.moveTo(-2, 3); ctx.lineTo(-5, 5.5); ctx.moveTo(2, 3); ctx.lineTo(5, 5.5); ctx.stroke();
      ctx.restore();

      // orbs
      for (const o of s.orbs) {
        const c = o.bad ? DANGER : s.accent;
        ctx.save();
        // trail
        const tg = ctx.createLinearGradient(0, o.y - 90, 0, o.y);
        tg.addColorStop(0, "rgba(0,0,0,0)"); tg.addColorStop(1, o.bad ? "rgba(255,61,90,0.5)" : `rgb(${s.accentRgb} / 0.5)`);
        ctx.strokeStyle = tg; ctx.lineWidth = o.bad ? 3 : 2; ctx.beginPath(); ctx.moveTo(o.x, o.y - 90); ctx.lineTo(o.x, o.y); ctx.stroke();
        ctx.translate(o.x, o.y);
        ctx.shadowColor = c; ctx.shadowBlur = 18;
        if (o.bad) {
          // spiky glitch mine with chromatic ghosts
          const spikes = 7;
          const draw = (rot: number, col: string, fill: boolean) => {
            ctx.save(); ctx.rotate(rot); ctx.beginPath();
            for (let i = 0; i < spikes * 2; i++) { const rr = i % 2 ? o.r * 0.55 : o.r; const a = (i / (spikes * 2)) * Math.PI * 2; ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
            ctx.closePath(); ctx.strokeStyle = col; ctx.lineWidth = 2; if (fill) { ctx.fillStyle = "#121212"; ctx.fill(); } ctx.stroke(); ctx.restore();
          };
          if (!s.reduced) { ctx.globalAlpha = 0.5; draw(o.rot + 0.2, "#4df0ff", false); draw(o.rot - 0.2, "#ff2bd6", false); ctx.globalAlpha = 1; }
          draw(o.rot, DANGER, true);
          ctx.fillStyle = DANGER; ctx.fillRect(-4, -4, 8, 8);
        } else {
          // customer capsule
          ctx.rotate(Math.sin(o.rot) * 0.15);
          ctx.fillStyle = "#121212"; ctx.strokeStyle = c; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.roundRect(-o.r, -o.r * 0.7, o.r * 2, o.r * 1.4, 6); ctx.fill(); ctx.stroke();
          ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-o.r * 0.6, -o.r * 0.3); ctx.lineTo(0, o.r * 0.15); ctx.lineTo(o.r * 0.6, -o.r * 0.3); ctx.stroke();
          ctx.fillStyle = c; ctx.fillRect(-o.r * 0.6, o.r * 0.3, o.r * 1.2, 2);
        }
        ctx.restore();
        ctx.fillStyle = o.bad ? "rgba(255,120,140,0.95)" : "rgba(255,255,255,0.85)";
        ctx.font = "600 11px var(--font-geist-mono), monospace"; ctx.textAlign = "center";
        ctx.fillText(o.bad ? o.label.toUpperCase() : o.label, o.x, o.y - o.r - 10);
      }

      // bolts
      for (const b of s.bolts) {
        ctx.save(); ctx.shadowColor = s.accent; ctx.shadowBlur = 14; ctx.fillStyle = "#ffffff"; ctx.fillRect(b.x - 1.5, b.y - 18, 3, 24);
        ctx.fillStyle = s.accent; ctx.fillRect(b.x - 3, b.y - 6, 6, 12); ctx.restore();
      }

      // ship + shield beam
      ctx.save(); ctx.translate(sx, shipY);
      const flick = s.reduced ? 1 : 0.7 + Math.random() * 0.6;
      ctx.fillStyle = `rgb(${s.accentRgb} / 0.9)`;
      ctx.beginPath(); ctx.moveTo(-10, 14); ctx.lineTo(-5, 14 + 16 * flick); ctx.lineTo(0, 14); ctx.fill();
      ctx.beginPath(); ctx.moveTo(10, 14); ctx.lineTo(5, 14 + 16 * flick); ctx.lineTo(0, 14); ctx.fill();
      ctx.shadowColor = s.accent; ctx.shadowBlur = 24;
      ctx.fillStyle = "#f5f5f7"; ctx.beginPath(); ctx.moveTo(0, -18); ctx.lineTo(16, 12); ctx.lineTo(-16, 12); ctx.closePath(); ctx.fill();
      ctx.fillStyle = s.hitFlash > 0 ? "#ffffff" : s.accent; ctx.fillRect(-shieldW / 2, -8, shieldW, 5);
      ctx.shadowBlur = 0; ctx.fillStyle = "rgba(255,255,255,0.9)"; ctx.fillRect(-shieldW / 2, -8, shieldW, 1.5);
      ctx.restore();

      // particles, rings, pops
      for (const p of s.parts) { ctx.save(); ctx.globalAlpha = Math.max(0, p.life); ctx.translate(p.x, p.y); ctx.rotate(p.spin * (1 - p.life)); ctx.fillStyle = p.c; ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r); ctx.restore(); }
      for (const r of s.rings) { ctx.globalAlpha = Math.max(0, r.life); ctx.strokeStyle = r.c; ctx.lineWidth = 2 + r.life * 3; ctx.beginPath(); ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2); ctx.stroke(); }
      ctx.globalAlpha = 1;
      for (const p of s.pops) {
        const a = Math.min(1, p.life); ctx.globalAlpha = a; ctx.fillStyle = p.c; ctx.textAlign = "center";
        if (p.big) { ctx.font = "700 44px var(--font-space-grotesk), sans-serif"; ctx.shadowColor = p.c; ctx.shadowBlur = 30; ctx.fillText(p.t, p.x, p.y - (1.6 - p.life) * 20); ctx.shadowBlur = 0; }
        else { ctx.font = "700 12px var(--font-geist-mono), monospace"; ctx.fillText(p.t, p.x, p.y - (1 - p.life) * 34); }
      }
      ctx.globalAlpha = 1;

      // in-canvas HUD
      if (playing) {
        ctx.textAlign = "left"; ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.font = "600 10px var(--font-geist-mono), monospace";
        ctx.fillText("SCORE", 18, 26); ctx.fillText("WAVE", 18, 68);
        ctx.fillStyle = "#ffffff"; ctx.font = "700 30px var(--font-space-grotesk), sans-serif"; ctx.fillText(String(s.score).padStart(5, "0"), 18, 54);
        ctx.font = "700 18px var(--font-space-grotesk), sans-serif"; ctx.fillText(String(s.wave).padStart(2, "0"), 18, 88);
        if (s.combo > 1) { ctx.fillStyle = s.accent; ctx.font = "700 14px var(--font-space-grotesk), sans-serif"; ctx.fillText(`COMBO x${s.combo}`, 18, 112); }
        ctx.textAlign = "right"; ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.font = "600 10px var(--font-geist-mono), monospace"; ctx.fillText("TIME", w - 18, 26);
        const tl = Math.max(0, ROUND - elapsed);
        ctx.fillStyle = tl <= 5 ? DANGER : "#ffffff"; ctx.font = "700 30px var(--font-space-grotesk), sans-serif"; ctx.fillText(tl.toFixed(1), w - 18, 54);
        ctx.fillStyle = "rgba(255,255,255,0.12)"; ctx.fillRect(w - 18 - 120, 62, 120, 4);
        ctx.fillStyle = tl <= 5 ? DANGER : s.accent; ctx.fillRect(w - 18 - 120 * (tl / ROUND), 62, 120 * (tl / ROUND), 4);
        for (let i = 0; i < LIVES; i++) {
          const x = w - 18 - i * 22, y = 90; ctx.fillStyle = i < s.lives ? "#ffffff" : "rgba(255,255,255,0.15)";
          ctx.beginPath(); ctx.moveTo(x - 7, y - 8); ctx.lineTo(x + 7, y - 8); ctx.lineTo(x + 7, y + 2); ctx.lineTo(x, y + 8); ctx.lineTo(x - 7, y + 2); ctx.closePath(); ctx.fill();
        }
        ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.font = "600 10px var(--font-geist-mono), monospace"; ctx.fillText("AGENT", w - 18, 112);
      }
      if (s.flash > 0) { ctx.fillStyle = `rgba(255,61,90,${s.flash * 0.28})`; ctx.fillRect(-30, -30, w + 60, h + 60); }
      // vignette
      const vg = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.max(w, h) * 0.75);
      vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,0.55)"); ctx.fillStyle = vg; ctx.fillRect(-30, -30, w + 60, h + 60);
      ctx.restore();
      s.raf = requestAnimationFrame(frame);
    };
    s.raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(s.raf);
  }, [finish]);

  const result = rank(final.score);

  return (
    <div className="game-bezel relative overflow-clip rounded-2xl" data-live-skip>
      <div ref={wrap} className="relative aspect-[4/5] w-full overflow-clip rounded-t-2xl bg-[#0b0b0c] touch-none sm:aspect-[16/9]">
        <canvas ref={canvas} tabIndex={0} aria-label="Shield the agent, an arcade game" className="block h-full w-full cursor-none outline-none" />
        <div aria-hidden="true" className="game-scan pointer-events-none absolute inset-0" />

        {/* mute */}
        <button
          type="button"
          onClick={() => { sfx.current.muted = !muted; setMuted(!muted); }}
          className="label absolute bottom-3 left-3 z-10 rounded-md border border-white/15 bg-[#121212]/80 px-2.5 py-1.5 text-white/70 hover:text-white"
          aria-pressed={muted}
        >
          {muted ? "Sound off" : "Sound on"}
        </button>

        {phase !== "playing" && (
          <div className="game-title absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0b0b0c]/70 p-6 text-center">
            {phase === "idle" ? (
              <>
                <p className="label text-brand-400">Intermission · Arcade</p>
                <h3 className="game-glitch display mt-3 text-5xl text-white sm:text-7xl" data-text="SHIELD THE AGENT">SHIELD THE AGENT</h3>
                <div className="mt-6 grid gap-x-8 gap-y-2 text-left sm:grid-cols-3">
                  {[
                    ["Move", "Mouse · drag · ← →"],
                    ["Fire", "Click · space"],
                    ["Goal", "Shoot the red, let the blue through"],
                  ].map(([k, v]) => (
                    <p key={k} className="label text-neutral-400"><span className="text-white">{k}</span> · {v}</p>
                  ))}
                </div>
                <button type="button" onClick={start} className="btn btn--solid game-blink mt-8 text-sm">
                  <span className="btn-ico">▶</span>
                  <span>Press start</span>
                </button>
              </>
            ) : (
              <>
                <p className="label text-brand-400">{final.won ? "Round complete" : "Game over"}</p>
                <h3 className="game-glitch display mt-3 text-5xl text-white sm:text-7xl" data-text={result.title.toUpperCase()}>{result.title}</h3>
                <p className="display mt-4 text-6xl text-white tabular-nums sm:text-7xl">{String(final.score).padStart(5, "0")}</p>
                <p className="mt-3 max-w-sm text-sm text-neutral-300">{result.note}</p>
                <p className="label mt-3 text-neutral-500">
                  {final.blocked} destroyed · {final.passed} answered
                  {best !== null && final.score >= best && final.score > 0 ? " · new high score" : best ? ` · high score ${String(best).padStart(5, "0")}` : ""}
                </p>
                <button type="button" onClick={start} className="btn btn--solid game-blink mt-8 text-sm">
                  <span className="btn-ico">▶</span>
                  <span>Play again</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
      {/* bezel labels */}
      <div className="flex items-center justify-between border-t hairline px-4 py-2">
        <span className="label text-neutral-500">Nishy Arcade · 01</span>
        <span className="label text-neutral-500">{ROUND}s round · 3 lives · high score saved locally</span>
      </div>
    </div>
  );
}
