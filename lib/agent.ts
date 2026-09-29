/** Agent Studio — Nishanthan's second product. Single source of truth for links and copy. */
export const AGENT_STUDIO = {
  name: "Agent Studio",
  url: "https://agents.nishyai.com/",
  host: "agents.nishyai.com",
  tagline: "Design the agent. We run it as an API.",
  description:
    "Design an AI agent on a canvas, wrap it in guardrails and a prompt-injection shield, and deploy it as an API.",
  backend:
    "Every design compiles into an immutable, versioned deployment behind one stable endpoint, and every call is logged with its stage-by-stage trace, latency and token usage in Neon serverless Postgres.",
  stack: ["Next.js", "Groq · GPT-OSS & Llama", "Llama Prompt Guard 2", "Neon Postgres", "Polar", "Vercel"],
  trial: "7-day free trial · One agent · No card required",
} as const;
