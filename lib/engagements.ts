/**
 * Engagement shapes, price anchors and the trust facts clients ask about.
 * PRICES ARE ANCHORS: edit the figures here and they flow to the page, the
 * structured data and the markdown twin.
 */
export const ENGAGEMENTS = {
  currency: "USD",
  shapes: [
    {
      id: "discovery",
      name: "Discovery sprint",
      length: "1 week, fixed scope",
      from: 1500,
      unit: "fixed",
      fit: "You have a process that costs time and want to know, with evidence, whether AI should run it.",
      deliverables: ["A map of the process, its data and its tools", "A clickable prototype of the agent or workflow", "Risks, guardrails and a build estimate", "A decision: product, custom build, or neither"],
    },
    {
      id: "build",
      name: "Production build",
      length: "3 to 8 weeks",
      from: 6000,
      unit: "project",
      fit: "The discovery said yes. Now it has to run every day, safely, with people in the loop where it matters.",
      deliverables: ["Agent, workflow or assistant on your data and tools", "Evaluation set, guardrails and monitoring", "Weekly increments you can click", "Handover with documentation; you own the code"],
    },
    {
      id: "operate",
      name: "Operate and improve",
      length: "Monthly, cancel any time",
      from: 900,
      unit: "month",
      fit: "You would rather I keep it running, watch the traces, and ship improvements than hire for it.",
      deliverables: ["Monitoring, incident response and model updates", "Monthly review of traces and failed runs", "A fixed block of improvement hours", "Same-day replies on business days"],
    },
  ],
  weekRate: { from: 1800, note: "Builds are quoted as a project, but this is the figure they are built from." },
} as const;

export type Shape = (typeof ENGAGEMENTS.shapes)[number];

/** How working together is set up. Mirrors the terms published for Agent Studio and Flows. */
export const WORKING_TOGETHER = [
  { title: "Contracts", body: "A short statement of work for sprints and builds: scope, timeline, price, what you own. For ongoing work, a monthly agreement you can cancel with 30 days' notice. Governed by the laws of Sri Lanka unless your legal team needs otherwise." },
  { title: "NDA", body: "Happy to sign your NDA before discovery starts, or to send a mutual one if you prefer. Nothing about your business appears on this site without written permission." },
  { title: "Invoicing", body: "Invoices in US dollars. Sprints are paid up front; builds are split into milestones, typically a deposit then weekly or fortnightly; operate plans are monthly in advance. Invoices carry everything your accounts team needs." },
  { title: "Paying from abroad", body: "Clients are in the US, UK, Europe and Asia-Pacific. International bank transfer is standard; card payment by secure link is available if that is easier for your finance process. The two products bill through Polar as merchant of record, which handles taxes and receipts." },
  { title: "Your data", body: "Secrets live in your environment, encrypted at rest. Nothing of yours is used to train models. Builds use the same providers as my products, Vercel, Neon Postgres, Groq and Anthropic, or whatever your stack requires, under their own privacy terms." },
  { title: "Ownership and exit", body: "You own the code, the prompts, the evaluation sets and the data. Handover includes documentation and a recorded walkthrough, and nothing is tied to my accounts." },
] as const;

export const ENGAGEMENT_FAQS = [
  { question: "Do you work with businesses outside Sri Lanka?", answer: "Yes. Most clients are in the US, UK, Europe and Asia-Pacific. Work is remote-first from Colombo with overlap for those time zones, invoices are in US dollars, and payment works by international bank transfer or card." },
  { question: "What does a discovery sprint cost?", answer: `A discovery sprint is a fixed ${ENGAGEMENTS.currency} ${ENGAGEMENTS.shapes[0].from.toLocaleString("en-US")} for one week, and ends with a prototype you can click and a clear recommendation, including the honest answer that an off-the-shelf product covers your case.` },
  { question: "How long does a production build take?", answer: "Three to eight weeks for most agents, workflows and assistants, delivered in weekly increments. The discovery sprint sets the estimate, and the build is quoted as a project rather than by the hour." },
  { question: "Will you sign an NDA?", answer: "Yes, before discovery if you like. Your NDA or a mutual one from me, whichever is faster for you." },
  { question: "Who owns what you build?", answer: "You do. Code, prompts, evaluation sets and data are yours, with documentation and a handover walkthrough. You can take it in-house or keep me on an operate plan." },
] as const;
