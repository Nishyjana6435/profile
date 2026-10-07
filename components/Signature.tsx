"use client";

import { useEffect, useRef } from "react";

/** A handwritten "Nishy" that draws itself when it scrolls into view. */
export default function Signature({ className = "" }: { className?: string }) {
  const ref = useRef<SVGSVGElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { el.classList.add("is-on"); io.disconnect(); } }, { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <svg ref={ref} viewBox="0 0 260 110" className={`sig ${className}`} role="img" aria-label="Signed, Nishy">
      <text x="8" y="78" className="sig-text">Nishy</text>
      <path className="sig-line" d="M14 92 C 70 100, 150 84, 236 90" />
    </svg>
  );
}
