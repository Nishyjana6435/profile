"use client";

import { usePathname } from "next/navigation";
import { reducedMotion } from "@/lib/a11y";
import { useEffect } from "react";

/**
 * Every word under <main> reacts to the pointer: words near the cursor lift,
 * grow a touch and brighten, with lag. Text is wrapped into word spans once
 * after hydration; only the blocks under and around the pointer are animated,
 * so the cost stays flat however long the page is.
 */
const BLOCKS = "h1,h2,h3,h4,p,li,a,button,label,dt,dd,summary,blockquote,td,th,figcaption,div";
const SKIP = "canvas,svg,script,style,textarea,input,select,[data-live-skip],.lt,.lw,.count,[aria-live],.tw-word,.sw-word,.sr-word,.np-toggle";
const REACH = 150;

export default function LiveText() {
  const pathname = usePathname();
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches || reducedMotion()) return;
    const root = document.querySelector("main");
    if (!root) return;

    // 1) wrap words
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        const p = n.parentElement;
        if (!p || p.closest(SKIP)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    const nodes: Text[] = [];
    while (walker.nextNode()) nodes.push(walker.currentNode as Text);
    for (const t of nodes) {
      const parent = t.parentElement!;
      // text that is a direct child of a flex or grid box must stay one item,
      // otherwise the words would be laid out as separate flex children
      const display = getComputedStyle(parent).display;
      const holder = /flex|grid/.test(display) ? document.createElement("span") : null;
      const frag = holder ?? document.createDocumentFragment();
      for (const part of t.nodeValue!.split(/(\s+)/)) {
        if (!part) continue;
        if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(part));
        else {
          const s = document.createElement("span");
          s.className = "lw";
          s.textContent = part;
          frag.appendChild(s);
        }
      }
      parent.replaceChild(frag, t);
      parent.closest(BLOCKS)?.setAttribute("data-live", "");
    }

    // 2) animate words near the pointer
    const active = new Map<HTMLElement, { y: number; k: number }>();
    let px = -9999, py = -9999, raf = 0;
    const loop = () => {
      for (const dy of [-120, 0, 120]) {
        const el = document.elementFromPoint(px, py + dy);
        const block = el?.closest("[data-live]");
        if (!block) continue;
        block.querySelectorAll<HTMLElement>(".lw").forEach((w) => {
          if (!active.has(w)) active.set(w, { y: 0, k: 0 });
        });
      }
      let moving = false;
      for (const [w, st] of active) {
        const r = w.getBoundingClientRect();
        const d = Math.hypot(px - (r.left + r.width / 2), py - (r.top + r.height / 2));
        const k = Math.max(0, 1 - d / REACH);
        const kk = k * k;
        st.y += (-7 * kk - st.y) * 0.18;
        st.k += (kk - st.k) * 0.18;
        const done = kk === 0 && Math.abs(st.y) < 0.05 && st.k < 0.01;
        if (done) {
          w.style.transform = "";
          w.style.removeProperty("--k");
          active.delete(w);
        } else {
          w.style.transform = `translateY(${st.y.toFixed(2)}px) scale(${(1 + st.k * 0.06).toFixed(3)})`;
          w.style.setProperty("--k", st.k.toFixed(3));
          moving = true;
        }
      }
      raf = moving ? requestAnimationFrame(loop) : 0;
    };
    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onLeave = () => {
      px = -9999;
      py = -9999;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname]);
  return null;
}
