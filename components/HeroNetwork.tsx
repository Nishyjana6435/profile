/**
 * Background for the hero: a faint network of workflow and agent nodes whose
 * paths lead into the photo at the centre, with pulses travelling inward.
 * Static SVG + SMIL, no JS.
 */
const CX = 600;
const CY = 192;

type N = { x: number; y: number; label?: string; tone: "v" | "f" | "s" | "e" };
const NODES: N[] = [
  { x: 70, y: 90, label: "trigger", tone: "s" },
  { x: 210, y: 40, tone: "v" },
  { x: 60, y: 330, label: "sheet", tone: "e" },
  { x: 190, y: 470, label: "slack", tone: "f" },
  { x: 330, y: 140, label: "agent", tone: "v" },
  { x: 300, y: 380, tone: "s" },
  { x: 1130, y: 80, label: "deploy", tone: "e" },
  { x: 990, y: 40, tone: "f" },
  { x: 1140, y: 320, label: "guardrail", tone: "v" },
  { x: 1010, y: 470, label: "api", tone: "s" },
  { x: 870, y: 150, label: "sub-agent", tone: "f" },
  { x: 900, y: 390, tone: "v" },
];
const TONE = { v: "#a78bfa", f: "#f0abfc", s: "#7dd3fc", e: "#6ee7b7" };

/* Each outer node links to a mid node, every mid node curves into the centre. */
const LINKS: [number, number][] = [
  [0, 4], [1, 4], [2, 5], [3, 5], [6, 10], [7, 10], [8, 11], [9, 11], [0, 1], [6, 7], [2, 3], [8, 9],
];
const INTO = [4, 5, 10, 11];

function curve(a: { x: number; y: number }, b: { x: number; y: number }) {
  const mx = (a.x + b.x) / 2;
  return `M${a.x} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`;
}

export default function HeroNetwork() {
  const center = { x: CX, y: CY };
  const paths = [
    ...LINKS.map(([a, b]) => ({ id: `l${a}-${b}`, d: curve(NODES[a], NODES[b]), strong: false })),
    ...INTO.map((i) => ({ id: `c${i}`, d: curve(NODES[i], center), strong: true })),
  ];

  return (
    <svg
      aria-hidden="true"
      className="hx-net pointer-events-none absolute left-1/2 top-0 h-[640px] w-[1400px] max-w-none -translate-x-1/2 sm:h-[760px]"
      viewBox="0 0 1200 560"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="hx-line" x1="0" x2="1">
          <stop offset="0" stopColor="#a78bfa" stopOpacity="0.05" />
          <stop offset="0.5" stopColor="#c4b5fd" stopOpacity="0.35" />
          <stop offset="1" stopColor="#7dd3fc" stopOpacity="0.08" />
        </linearGradient>
        <radialGradient id="hx-node-glow">
          <stop offset="0" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {paths.map((p) => (
        <path key={p.id} id={`hx-${p.id}`} d={p.d} className={`hx-net-path ${p.strong ? "is-strong" : ""}`} />
      ))}

      {/* pulses flowing along the links and into the centre */}
      {paths.map((p, i) => (
        <circle key={`d${p.id}`} r={p.strong ? 2.6 : 1.8} className="hx-net-pulse" fill={p.strong ? "#f0abfc" : "#c4b5fd"}>
          <animateMotion dur={`${p.strong ? 3.2 : 4.5 + (i % 4) * 0.7}s`} begin={`${(i * 0.53) % 4}s`} repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
            <mpath href={`#hx-${p.id}`} />
          </animateMotion>
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.85;1" dur={`${p.strong ? 3.2 : 4.5 + (i % 4) * 0.7}s`} begin={`${(i * 0.53) % 4}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {NODES.map((n, i) => (
        <g key={i} className="hx-net-node" style={{ animationDelay: `${(i * 0.4) % 4}s` }}>
          <circle cx={n.x} cy={n.y} r="14" fill="url(#hx-node-glow)" opacity="0.12" />
          <circle cx={n.x} cy={n.y} r="4.5" fill="#0a0514" stroke={TONE[n.tone]} strokeWidth="1.5" />
          <circle cx={n.x} cy={n.y} r="1.8" fill={TONE[n.tone]} />
          {n.label && (
            <text x={n.x} y={n.y + 20} textAnchor="middle" className="hx-net-label">
              {n.label}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}
