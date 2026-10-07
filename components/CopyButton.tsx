"use client";

import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1600);
        } catch {}
      }}
      className="label rounded-md border border-white/15 px-2 py-1 text-white/70 transition-colors hover:border-white/40 hover:text-white"
      aria-live="polite"
    >
      {done ? "Copied" : "Copy"}
    </button>
  );
}
