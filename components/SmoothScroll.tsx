"use client";

import { useEffect } from "react";

/**
 * Inertial wheel scrolling: wheel input moves a target, the page eases toward it.
 * Keyboard, touch, anchor links and scrollbar drags stay native. Off for touch
 * devices and reduced motion. Scrollable children (chat list, tab strips) keep
 * their own wheel behaviour.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const html = document.documentElement;
    // native smooth scrolling would compound with ours; take it over, anchors included
    html.classList.add("has-smooth");
    let target = window.scrollY, current = target, raf = 0, ours = false;

    const scrollableAncestor = (el: Element | null, dy: number) => {
      while (el && el !== html && el !== document.body) {
        const s = getComputedStyle(el);
        if (/(auto|scroll)/.test(s.overflowY) && el.scrollHeight > el.clientHeight + 1) {
          const atTop = el.scrollTop <= 0, atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
          if (!(dy < 0 && atTop) && !(dy > 0 && atBottom)) return true;
        }
        el = el.parentElement;
      }
      return false;
    };
    const loop = () => {
      const d = target - current;
      if (Math.abs(d) < 0.4) {
        current = target;
        ours = true; window.scrollTo(0, current); ours = false;
        raf = 0;
        return;
      }
      current += d * 0.13;
      ours = true; window.scrollTo(0, current); ours = false;
      raf = requestAnimationFrame(loop);
    };
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) return;
      if (scrollableAncestor(e.target as Element | null, e.deltaY)) return;
      e.preventDefault();
      const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY;
      const max = html.scrollHeight - window.innerHeight;
      if (!raf) current = window.scrollY;
      target = Math.min(max, Math.max(0, target + dy));
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onScroll = () => {
      if (ours) return;
      // someone else scrolled (keys, anchors, scrollbar): adopt their position
      if (!raf) { target = window.scrollY; current = target; }
    };
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const el = document.querySelector(a.getAttribute("href") || "");
      if (!el) return;
      e.preventDefault();
      history.pushState(null, "", a.getAttribute("href"));
      if (!raf) current = window.scrollY;
      target = Math.max(0, el.getBoundingClientRect().top + window.scrollY - 72);
      if (!raf) raf = requestAnimationFrame(loop);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("click", onClick);
    return () => {
      html.classList.remove("has-smooth");
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onClick);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}
