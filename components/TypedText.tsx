"use client";

import { useEffect, useState } from "react";

export default function TypedText({
  text,
  speed = 70,
  startDelay = 400,
}: {
  text: string;
  speed?: number;
  startDelay?: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let i = 0;
    const tick = () => {
      i = reduceMotion ? text.length : i + 1;
      setCount(i);
      if (i < text.length) timer = setTimeout(tick, speed);
    };
    let timer = setTimeout(tick, reduceMotion ? 0 : startDelay);
    return () => clearTimeout(timer);
  }, [text, speed, startDelay]);

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{text.slice(0, count)}</span>
      <span
        aria-hidden="true"
        className="animate-[blink-caret_1s_step-end_infinite] text-violet-400"
      >
        |
      </span>
    </>
  );
}
