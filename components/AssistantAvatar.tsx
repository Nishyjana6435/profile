/** Animated orb avatar for the assistant: gradient sphere, blinking eyes, orbit ring. */
export default function AssistantAvatar({ size = 56, talking = false }: { size?: number; talking?: boolean }) {
  return (
    <span className={`as-avatar ${talking ? "is-talking" : ""}`} style={{ width: size, height: size }} aria-hidden="true">
      <span className="as-orbit" />
      <svg viewBox="0 0 64 64" className="relative h-full w-full">
        <defs>
          <radialGradient id="as-sphere" cx="35%" cy="28%" r="75%">
            <stop offset="0" stopColor="var(--accent-100)" />
            <stop offset="0.35" stopColor="var(--accent-400)" />
            <stop offset="0.7" stopColor="var(--accent-500)" />
            <stop offset="1" stopColor="#2a2a2a" />
          </radialGradient>
          <radialGradient id="as-sphere-ink" cx="35%" cy="28%" r="75%">
            <stop offset="0" stopColor="#3a3a3a" />
            <stop offset="0.5" stopColor="#1a1a1a" />
            <stop offset="1" stopColor="#050505" />
          </radialGradient>
          <radialGradient id="as-shine" cx="30%" cy="22%" r="30%">
            <stop offset="0" stopColor="#fff" stopOpacity="0.85" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle className="as-sphere" cx="32" cy="32" r="28" fill="url(#as-sphere)" />
        <circle cx="32" cy="32" r="28" fill="url(#as-shine)" />
        <rect x="16" y="24" width="32" height="18" rx="9" fill="#1a1a1a" opacity="0.9" />
        <g className="as-eyes">
          <ellipse cx="25.5" cy="33" rx="3" ry="3.6" fill="#e5e5e5" />
          <ellipse cx="38.5" cy="33" rx="3" ry="3.6" fill="#e5e5e5" />
        </g>
        <path className="as-mouth" d="M28 46.5q4 3 8 0" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.9" />
      </svg>
    </span>
  );
}
