import { FLOWS } from "@/lib/flows";
import ExplodedScene from "./ExplodedScene";

export function FlowsLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      <rect width="32" height="32" rx="9" fill="#f5f5f7" />
      <circle cx="9" cy="16" r="3" fill="#2ee6a6" />
      <circle cx="23" cy="9" r="3" fill="#121317" />
      <circle cx="23" cy="23" r="3" fill="#121317" />
      <path d="M11.5 14.5 20.5 10.2M11.5 17.5l9 4.3" stroke="#121317" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** Flows as an exploded drawing: the product, the plain-English prompt, the running workflow. */
export default function FlowsScene() {
  return (
    <ExplodedScene
      host={FLOWS.host}
      logo={<FlowsLogo />}
      status="Run succeeded · 1.8 s"
      callouts={[
        { title: "Describe it", sub: "Plain English prompt" },
        { title: "Flows drafts it", sub: "Trigger, steps, apps" },
        { title: "It runs", sub: "Around the clock" },
      ]}
      plates={[
        { src: "/flows/hero.webp", alt: `${FLOWS.name} landing page: “${FLOWS.tagline}”`, width: 1440, height: 1010, pos: "left-[30%] top-[12%] w-[62%]", z: 0, delay: 0, anchor: [52, 30] },
        { src: "/flows/prompt.webp", alt: "Flows prompt panel: describe what should happen in plain English", width: 486, height: 325, pos: "left-[29%] bottom-[24%] w-[38%]", z: 90, delay: 0.25, anchor: [44, 62] },
        { src: "/flows/workflow.webp", alt: "Flows workflow panel: trigger, steps and a successful test run", width: 536, height: 325, pos: "right-[2%] bottom-[6%] w-[46%]", z: 170, delay: 0.5, anchor: [66, 82] },
      ]}
    />
  );
}
