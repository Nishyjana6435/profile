import { AGENT_STUDIO } from "@/lib/agent";
import { FLOWS } from "@/lib/flows";

export const AGENT_STUDIO_FLOWS_NEWS = {
  slug: "agent-studio-flows",
  path: "/news/agent-studio-flows",
  date: "2026-09-28",
  title: "Agent Studio agents now run inside Flows",
  seoTitle: "New: Agent Studio AI Agents Now Run Inside Flows Workflows Automatically",
  description:
    "Deploy an AI agent in Agent Studio, flip one switch, and it appears in Flows as a ready-to-use workflow step. No API keys to copy, no glue code. Guardrails and the injection shield still run on every call.",
  poster: "/news/agent-studio-x-flows.webp",
  posterAlt:
    "Poster: Your AI agents now run inside your workflows. Agent Studio's Deploy dialog with 'Add this agent to Flows automatically' switched on, syncing to a Flows workflow step 'Ask Support Copilot'.",
  intro:
    "Until today, using an AI agent in an automation meant copying an endpoint, pasting an API key and writing glue code. Now it is one switch.",
  steps: [
    { title: "Deploy your agent in Agent Studio", body: "Design the orchestrator, sub-agents, guardrails and shield on the canvas, then open the Deploy dialog." },
    { title: "Turn on “Add this agent to Flows automatically”", body: "Agent Studio registers the deployed agent with Flows and re-registers it on every deploy, so the step always calls your latest version." },
    { title: "Use it as a step in Flows", body: "The agent appears in Flows as “Ask <agent name>”. Drop it between any trigger and action, like a new support email in and a Slack reply out." },
  ],
  benefits: [
    { title: "One switch", body: "Turn it on in the Deploy dialog. Every redeploy syncs itself." },
    { title: "Guardrails included", body: "The injection shield and your policies still run on every call from Flows. Blocked inputs return your configured refusal." },
    { title: "Signed and encrypted", body: "Sync requests are HMAC-signed with a shared secret, API keys are encrypted at rest, and accounts are matched by the same Google login." },
  ],
  example: ["New support email", "Ask Support Copilot", "Post answer to #support"],
  links: { agentStudio: AGENT_STUDIO.url, flows: FLOWS.url },
} as const;
