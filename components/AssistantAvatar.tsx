/** Animated orb avatar for the assistant: gradient sphere, blinking eyes, orbit ring. */
export default function AssistantAvatar({ size = 56, talking = false }: { size?: number; talking?: boolean }) {
  return (
    <span className={`as-avatar ${talking ? "is-talking" : ""}`} style={{ width: size, height: size }} aria-hidden="true">
      <span className="as-orbit" />
      <svg viewBox="0 0 64 64" className="relative h-full w-full">
        <defs>
          <radialGradient id="as-sphere" cx="35%" cy="28%" r="75%">
            <stop offset="0" stopColor="#f5d0fe" />
            <stop offset="0.35" stopColor="#c084fc" />
            <stop offset="0.7" stopColor="#7c3aed" />
            <stop offset="1" stopColor="#312e81" />
          </radialGradient>
          <radialGradient id="as-shine" cx="30%" cy="22%" r="30%">
            <stop offset="0" stopColor="#fff" stopOpacity="0.85" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="32" cy="32" r="28" fill="url(#as-sphere)" />
        <circle cx="32" cy="32" r="28" fill="url(#as-shine)" />
        <rect x="16" y="24" width="32" height="18" rx="9" fill="#130a26" opacity="0.9" />
        <g className="as-eyes">
          <ellipse cx="25.5" cy="33" rx="3" ry="3.6" fill="#7dd3fc" />
          <ellipse cx="38.5" cy="33" rx="3" ry="3.6" fill="#7dd3fc" />
        </g>
        <path className="as-mouth" d="M28 46.5q4 3 8 0" stroke="#fdf4ff" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.9" />
      </svg>
    </span>
  );
}
