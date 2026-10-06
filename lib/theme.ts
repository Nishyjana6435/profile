/**
 * ONE PLACE TO CHANGE THE ACCENT COLOUR.
 *
 * Pick a preset below (or paste your own 11-step scale) and it applies everywhere:
 * Tailwind `brand-*` utilities, the CSS in globals.css, SVG logos, the cursor,
 * the favicon and the Open Graph images.
 *
 *   export const ACCENT = PRESETS.green;
 */
export const PRESETS = {
  blue: {
    50: "#eff6ff", 100: "#dbeafe", 200: "#bfdbfe", 300: "#93c5fd", 400: "#60a5fa",
    500: "#3b82f6", 600: "#2563eb", 700: "#1d4ed8", 800: "#1e40af", 900: "#1e3a8a", 950: "#172554",
  },
  red: {
    50: "#fff1f2", 100: "#ffe1e4", 200: "#ffc7cc", 300: "#ff8a95", 400: "#ff5a6a",
    500: "#e51e31", 600: "#c4162a", 700: "#9f1322", 800: "#7a1020", 900: "#5a0d19", 950: "#33060d",
  },
  green: {
    50: "#ecfdf5", 100: "#d1fae5", 200: "#a7f3d0", 300: "#6ee7b7", 400: "#34d399",
    500: "#10b981", 600: "#059669", 700: "#047857", 800: "#065f46", 900: "#064e3b", 950: "#022c22",
  },
  violet: {
    50: "#f5f3ff", 100: "#ede9fe", 200: "#ddd6fe", 300: "#c4b5fd", 400: "#a78bfa",
    500: "#8b5cf6", 600: "#7c3aed", 700: "#6d28d9", 800: "#5b21b6", 900: "#4c1d95", 950: "#2e1065",
  },
  amber: {
    50: "#fffbeb", 100: "#fef3c7", 200: "#fde68a", 300: "#fcd34d", 400: "#fbbf24",
    500: "#f59e0b", 600: "#d97706", 700: "#b45309", 800: "#92400e", 900: "#78350f", 950: "#451a03",
  },
} as const;

export type AccentScale = Record<50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950, string>;

/** 👇 change this line to experiment */
export const ACCENT: AccentScale = PRESETS.green;

export const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

export function hexToRgb(hex: string): string {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

/** CSS custom properties for :root, injected by the root layout. */
export function accentCss(scale: AccentScale = ACCENT): string {
  const vars = STEPS.map((s) => `--accent-${s}: ${scale[s]}; --accent-${s}-rgb: ${hexToRgb(scale[s])};`).join(" ");
  return `:root { ${vars} --accent: ${scale[500]}; }`;
}
