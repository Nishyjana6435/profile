"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

type Variant = "up" | "left" | "right" | "scale" | "fade";
type Tag = "div" | "section" | "p" | "h2" | "h3" | "span" | "ul" | "li";

export default function Reveal({
  children,
  variant = "up",
  delay = 0,
  stagger = false,
  className = "",
  as = "div",
  threshold = 0.15,
}: {
  children: ReactNode;
  variant?: Variant;
  delay?: number;
  stagger?: boolean;
  className?: string;
  as?: Tag;
  threshold?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  const classes = [
    "reveal",
    `reveal--${variant}`,
    stagger ? "reveal-stagger" : "",
    visible ? "is-visible" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // All supported tags share the HTMLElement surface we use; typing as "div" keeps JSX happy.
  const Tag = as as "div";

  return (
    <Tag
      ref={ref}
      className={classes}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
