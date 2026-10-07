/** Accessibility preferences, stored locally and applied as classes on <html>. */
export type A11yPrefs = {
  motion: boolean;   // reduce motion: no animations, no cursor effects, no inertial scroll
  contrast: boolean; // high contrast: pure black canvas, brighter greys, stronger lines
  text: boolean;     // larger text
  links: boolean;    // always underline links
  font: boolean;     // plain readable headings (Inter instead of the display face)
  focus: boolean;    // bold focus outlines
};

export const A11Y_KEY = "nishy-a11y";
export const A11Y_DEFAULTS: A11yPrefs = { motion: false, contrast: false, text: false, links: false, font: false, focus: false };
export const A11Y_KEYS = Object.keys(A11Y_DEFAULTS) as (keyof A11yPrefs)[];

/** Inline script for <head>: applies saved preferences before first paint, as data-a11y="motion contrast …". */
export const A11Y_BOOT = `try{var p=JSON.parse(localStorage.getItem("${A11Y_KEY}")||"{}"),k=${JSON.stringify(A11Y_KEYS)}.filter(function(x){return p[x]});if(k.length)document.documentElement.setAttribute("data-a11y",k.join(" "))}catch(e){}`;

export function readPrefs(): A11yPrefs {
  try { return { ...A11Y_DEFAULTS, ...(JSON.parse(localStorage.getItem(A11Y_KEY) || "{}") as Partial<A11yPrefs>) }; } catch { return { ...A11Y_DEFAULTS }; }
}
export function applyPrefs(p: A11yPrefs) {
  const on = A11Y_KEYS.filter((k) => p[k]);
  if (on.length) document.documentElement.setAttribute("data-a11y", on.join(" "));
  else document.documentElement.removeAttribute("data-a11y");
  try { localStorage.setItem(A11Y_KEY, JSON.stringify(p)); } catch {}
  window.dispatchEvent(new Event("nishy:a11y"));
}
/** True when the visitor asked for less motion, by OS setting or the site's own switch. */
export function reducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches || (document.documentElement.getAttribute("data-a11y") ?? "").split(" ").includes("motion");
}
/* store plumbing for useSyncExternalStore: the raw JSON string is the snapshot, so it stays referentially stable */
export const subscribePrefs = (cb: () => void) => { window.addEventListener("nishy:a11y", cb); window.addEventListener("storage", cb); return () => { window.removeEventListener("nishy:a11y", cb); window.removeEventListener("storage", cb); }; };
export const prefsSnapshot = () => { try { return localStorage.getItem(A11Y_KEY) ?? ""; } catch { return ""; } };
export const prefsServerSnapshot = () => "";
