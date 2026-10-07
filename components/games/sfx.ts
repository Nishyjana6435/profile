/** Tiny synth for the arcade: square and sine blips, no samples. */
export class Sfx {
  ctx: AudioContext | null = null;
  muted = false;
  init() {
    if (!this.ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AC) this.ctx = new AC();
    }
    this.ctx?.resume();
  }
  tone(f0: number, f1: number, dur: number, type: OscillatorType, vol = 0.08) {
    const c = this.ctx;
    if (!c || this.muted) return;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f0, c.currentTime);
    o.frequency.exponentialRampToValueAtTime(Math.max(30, f1), c.currentTime + dur);
    g.gain.setValueAtTime(vol, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
    o.connect(g).connect(c.destination);
    o.start();
    o.stop(c.currentTime + dur);
  }
  noise(dur: number, vol = 0.12) {
    const c = this.ctx;
    if (!c || this.muted) return;
    const buf = c.createBuffer(1, c.sampleRate * dur, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    const src = c.createBufferSource(), g = c.createGain(), f = c.createBiquadFilter();
    f.type = "lowpass"; f.frequency.value = 900;
    src.buffer = buf; g.gain.value = vol;
    src.connect(f).connect(g).connect(c.destination);
    src.start();
  }
  shot() { this.tone(1400, 300, 0.12, "square", 0.05); }
  block() { this.tone(300, 900, 0.09, "square", 0.07); this.noise(0.12, 0.08); }
  boom() { this.tone(200, 40, 0.5, "sawtooth", 0.12); this.noise(0.45, 0.25); }
  pass() { this.tone(520, 780, 0.14, "sine", 0.06); }
  oops() { this.tone(400, 150, 0.2, "triangle", 0.06); }
  wave() { this.tone(440, 880, 0.2, "square", 0.05); setTimeout(() => this.tone(660, 1320, 0.25, "square", 0.05), 120); }
}
