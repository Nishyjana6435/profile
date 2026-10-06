import { AGENT_STUDIO } from "@/lib/agent";
import ExplodedScene from "./ExplodedScene";

export function AgentLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      <rect width="32" height="32" rx="9" fill="#f5f5f7" />
      <circle cx="16" cy="10" r="3.4" fill="var(--accent-500)" />
      <circle cx="9" cy="22" r="2.8" fill="#121317" />
      <circle cx="23" cy="22" r="2.8" fill="#121317" />
      <path d="M16 13.6v3.2M14 18.8l-3.2 1.4M18 18.8l3.2 1.4" stroke="#121317" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** Agent Studio as an exploded drawing: the product, the canvas, the trace. */
export default function AgentScene() {
  return (
    <ExplodedScene
      host={AGENT_STUDIO.host}
      logo={<AgentLogo />}
      status="v3 live · shield pass"
      callouts={[
        { title: "Design it", sub: "Orchestrator + sub-agents" },
        { title: "Shield it", sub: "Guardrails, injection shield" },
        { title: "Deploy it", sub: "One endpoint, every version" },
      ]}
      plates={[
        { src: "/agent/hero.webp", alt: `${AGENT_STUDIO.name} landing page: “${AGENT_STUDIO.tagline}”`, width: 1440, height: 1010, pos: "left-[30%] top-[12%] w-[62%]", z: 0, delay: 0, anchor: [52, 30] },
        { src: "/agent/trace.webp", alt: "Agent Studio playground: an incoming message and the trace of the shield and guardrail stages", width: 640, height: 443, pos: "left-[29%] bottom-[22%] w-[38%]", z: 90, delay: 0.25, anchor: [44, 62] },
        { src: "/agent/canvas.webp", alt: "Agent Studio canvas: an orchestrator with a sub-agent, a guardrail and an injection shield, plus a test run", width: 720, height: 645, pos: "right-[2%] bottom-[4%] w-[42%]", z: 170, delay: 0.5, anchor: [66, 82] },
      ]}
    />
  );
}
