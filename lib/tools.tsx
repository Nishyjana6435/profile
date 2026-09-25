import type { ReactNode } from "react";
import {
  siClaude,
  siClerk,
  siContentful,
  siFigma,
  siGmail,
  siGoogle,
  siGooglesheets,
  siGraphql,
  siHuggingface,
  siMeta,
  siMongodb,
  siNeon,
  siNestjs,
  siNextdotjs,
  siPostgresql,
  siPython,
  siSnowflake,
  siTypescript,
  siVercel,
  type SimpleIcon,
} from "simple-icons";
import { AgentLogo } from "@/components/AgentScene";
import { FlowsLogo } from "@/components/FlowsScene";
import { AGENT_STUDIO } from "./agent";
import { FLOWS } from "./flows";

export type ToolCategory = "Apps" | "Messaging" | "Data" | "Models" | "Platform" | "Stack";

export type ToolUse = "Flows" | "Agent Studio" | "Client work";

export interface Tool {
  id: string;
  name: string;
  category: ToolCategory;
  /** Accent used for the tile glow and the selected ring. */
  color: string;
  icon: ReactNode;
  blurb: string;
  used: ToolUse[];
  /** Live products get a direct link and a section anchor on this page. */
  app?: { href: string; anchor: string; tagline: string };
}

export const TOOL_CATEGORIES: ToolCategory[] = ["Apps", "Messaging", "Data", "Models", "Platform", "Stack"];

export const TOOL_USE_LINKS: Record<ToolUse, string | null> = {
  Flows: FLOWS.url,
  "Agent Studio": AGENT_STUDIO.url,
  "Client work": null,
};

/** Brand marks that are near-black get drawn in white on the dark tile. */
function brand(icon: SimpleIcon, fill?: string): ReactNode {
  const hex = `#${icon.hex}`;
  const dark = parseInt(icon.hex, 16) < 0x222222;
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-full w-full">
      <path d={icon.path} fill={fill ?? (dark ? "#ffffff" : hex)} />
    </svg>
  );
}

const slackIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-full w-full">
    <rect x="9.6" y="2" width="4.2" height="9.6" rx="2.1" fill="#36C5F0" />
    <rect x="12.4" y="9.6" width="9.6" height="4.2" rx="2.1" fill="#2EB67D" />
    <rect x="10.2" y="12.4" width="4.2" height="9.6" rx="2.1" fill="#ECB22E" />
    <rect x="2" y="10.2" width="9.6" height="4.2" rx="2.1" fill="#E01E5A" />
  </svg>
);

const smsIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
    <path d="M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-4.6A8 8 0 1 1 21 12z" />
    <path d="M8.5 12h.01M12 12h.01M15.5 12h.01" strokeWidth="2.6" />
  </svg>
);

const apiIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="#f0abfc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
    <path d="M8 3H7a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2 2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h1" />
    <path d="M16 3h1a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2 2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h-1" />
    <path d="M10 12h4" />
  </svg>
);

const groqIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-full w-full">
    <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" fill="#F55036" />
  </svg>
);

const polarIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" className="h-full w-full">
    <circle cx="12" cy="12" r="9" />
    <path d="M5 9h14M4 12h16M5 15h14" strokeWidth="1.4" />
    <path d="M12 3c-3 2.6-3 15.4 0 18M12 3c3 2.6 3 15.4 0 18" strokeWidth="1.4" />
  </svg>
);

export const TOOLS: Tool[] = [
  // Apps (my own live products)
  {
    id: "flows",
    name: FLOWS.name,
    category: "Apps",
    color: "#e879f9",
    icon: <FlowsLogo className="h-full w-full" />,
    blurb: FLOWS.description,
    used: ["Flows"],
    app: { href: FLOWS.url, anchor: "/flows", tagline: FLOWS.tagline },
  },
  {
    id: "agent-studio",
    name: AGENT_STUDIO.name,
    category: "Apps",
    color: "#7c3aed",
    icon: <AgentLogo className="h-full w-full" />,
    blurb: AGENT_STUDIO.description,
    used: ["Agent Studio"],
    app: { href: AGENT_STUDIO.url, anchor: "/agent-studio", tagline: AGENT_STUDIO.tagline },
  },
  // Messaging
  { id: "slack", name: "Slack", category: "Messaging", color: "#E01E5A", icon: slackIcon, blurb: "Alerts, approvals and run summaries land in the channel where the team already talks.", used: ["Flows"] },
  { id: "gmail", name: "Gmail", category: "Messaging", color: "#EA4335", icon: brand(siGmail), blurb: "Send and read mail as a step in a flow, from confirmations to follow-ups.", used: ["Flows"] },
  { id: "sms", name: "SMS", category: "Messaging", color: "#22d3ee", icon: smsIcon, blurb: "Text a customer, or the person on call, when a run needs a human.", used: ["Flows"] },
  // Data
  { id: "sheets", name: "Google Sheets", category: "Data", color: "#34A853", icon: brand(siGooglesheets), blurb: "The small-business database. Flows appends, reads and updates rows without field mapping.", used: ["Flows"] },
  { id: "neon", name: "Neon", category: "Data", color: "#34D59A", icon: brand(siNeon), blurb: "Serverless Postgres behind both products: every flow, run, agent version and trace is durable and queryable.", used: ["Flows", "Agent Studio"] },
  { id: "postgres", name: "PostgreSQL", category: "Data", color: "#4169E1", icon: brand(siPostgresql), blurb: "The relational backbone. Schema, migrations and queries are plain Postgres, served by Neon.", used: ["Flows", "Agent Studio"] },
  { id: "mongodb", name: "MongoDB", category: "Data", color: "#47A248", icon: brand(siMongodb), blurb: "Document store for Node and NestJS backends on client platforms.", used: ["Client work"] },
  { id: "snowflake", name: "Snowflake", category: "Data", color: "#29B5E8", icon: brand(siSnowflake), blurb: "Led the migration of Paycor's on-prem client data into Snowflake with Python and SQL.", used: ["Client work"] },
  { id: "contentful", name: "Contentful", category: "Data", color: "#2478CC", icon: brand(siContentful), blurb: "Headless CMS behind this site and PandaDoc's marketing platform. An MCP server automates content modelling and publishing.", used: ["Client work"] },
  // Models
  { id: "claude", name: "Claude", category: "Models", color: "#D97757", icon: brand(siClaude), blurb: "Drafts the workflow, qualifies leads and reads failed runs to propose the fix.", used: ["Flows"] },
  { id: "groq", name: "Groq", category: "Models", color: "#F55036", icon: groqIcon, blurb: "Serves GPT-OSS 120B and 20B, Llama and Kimi K2 with low latency. Pick a model per node.", used: ["Agent Studio"] },
  { id: "llama", name: "Meta Llama", category: "Models", color: "#0467DF", icon: brand(siMeta), blurb: "Llama 3.3 70B and Llama 4 Maverick as orchestrator or sub-agent models.", used: ["Agent Studio"] },
  { id: "huggingface", name: "Hugging Face", category: "Models", color: "#FFD21E", icon: brand(siHuggingface), blurb: "Llama Prompt Guard 2, the classifier layer inside the injection shield.", used: ["Agent Studio"] },
  // Platform
  { id: "vercel", name: "Vercel", category: "Platform", color: "#a78bfa", icon: brand(siVercel), blurb: "Where this site and both products deploy, with Fluid Compute for the long-running agent calls.", used: ["Flows", "Agent Studio", "Client work"] },
  { id: "clerk", name: "Clerk", category: "Platform", color: "#6C47FF", icon: brand(siClerk), blurb: "Sign-in, organisations and sessions for Flows.", used: ["Flows"] },
  { id: "google", name: "Google sign-in", category: "Platform", color: "#4285F4", icon: brand(siGoogle), blurb: "One-click Google sign-in for Agent Studio.", used: ["Agent Studio"] },
  { id: "polar", name: "Polar", category: "Platform", color: "#e2e8f0", icon: polarIcon, blurb: "Trials, monthly plans and the customer portal for Agent Studio billing.", used: ["Agent Studio"] },
  { id: "api", name: "REST API", category: "Platform", color: "#f0abfc", icon: apiIcon, blurb: "Any HTTP endpoint becomes a step in Flows, and every deployed agent is one endpoint you call with a bearer key.", used: ["Flows", "Agent Studio"] },
  { id: "figma", name: "Figma", category: "Platform", color: "#F24E1E", icon: brand(siFigma), blurb: "Design source for an MCP server that generates Next.js code straight from frames.", used: ["Client work"] },
  // Stack
  { id: "nextjs", name: "Next.js", category: "Stack", color: "#c4b5fd", icon: brand(siNextdotjs), blurb: "App Router front end and back end for this site and both products.", used: ["Flows", "Agent Studio", "Client work"] },
  { id: "typescript", name: "TypeScript", category: "Stack", color: "#3178C6", icon: brand(siTypescript), blurb: "Everything here is typed end to end, from Postgres rows to React props.", used: ["Flows", "Agent Studio", "Client work"] },
  { id: "graphql", name: "GraphQL", category: "Stack", color: "#E10098", icon: brand(siGraphql), blurb: "API layer for NestJS services on client platforms.", used: ["Client work"] },
  { id: "nestjs", name: "NestJS", category: "Stack", color: "#E0234E", icon: brand(siNestjs), blurb: "Backend framework for GraphQL and REST services with clean module boundaries.", used: ["Client work"] },
  { id: "python", name: "Python", category: "Stack", color: "#3776AB", icon: brand(siPython), blurb: "Scripting, data migrations and LLM tooling.", used: ["Client work"] },
];
