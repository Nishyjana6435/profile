/** Flows — Nishanthan's own product. Single source of truth for links and copy. */
export const FLOWS = {
  name: "Flows",
  url: "https://create-your-flows.nishy.space/",
  host: "create-your-flows.nishy.space",
  tagline: "Describe the process. We run it.",
  description:
    "Describe a business process in plain English. Flows connects your apps, builds the workflow, and runs it for you.",
  backend:
    "Every flow, run and log is stored in Neon serverless Postgres, so runs survive restarts and history is queryable.",
  stack: ["Next.js", "Clerk", "Claude API", "Neon Postgres", "Tailwind CSS"],
} as const;
