import { AGENT_STUDIO } from "@/lib/agent";
import { FLOWS } from "@/lib/flows";
import type { ProductPageConfig } from "./types";

export const AGENT_STUDIO_PAGE: ProductPageConfig = {
  slug: "agent-studio",
  name: AGENT_STUDIO.name,
  url: AGENT_STUDIO.url,
  host: AGENT_STUDIO.host,
  tagline: AGENT_STUDIO.tagline,
  scene: "agent",
  accent: "sky",
  applicationCategory: "DeveloperApplication",
  seo: {
    title: "Agent Studio: Visual AI Agent Builder with Guardrails, Deployed as an API",
    description:
      "Build AI agents visually with Agent Studio. Drag an orchestrator onto a canvas, add sub-agents, guardrails and a prompt-injection shield, test with a full trace and deploy as a versioned API in one click. Models on Groq. 7-day free trial, no card.",
    keywords: [
      "visual AI agent builder",
      "build AI agents visually",
      "no-code AI agent builder",
      "AI agent platform",
      "deploy AI agent as API",
      "multi-agent orchestrator",
      "AI agent guardrails",
      "prompt injection protection",
      "Llama Prompt Guard 2",
      "OpenAI Agent Builder alternative",
      "Copilot Studio alternative",
      "Dify alternative hosted",
      "Flowise alternative",
      "GPT-OSS agent",
      "Agent Studio by Nishy",
    ],
  },
  hero: {
    eyebrow: "Visual AI agent builder · orchestrator, sub-agents, guardrails, one Deploy button",
    h1: "Build AI agents visually. Deploy them as an API in ten minutes.",
    highlight: "Deploy them as an API in ten minutes.",
    sub: "Drag an orchestrator onto the canvas, give it specialist sub-agents, wrap it in guardrails and a prompt-injection shield, test it with a full trace, then hit Deploy. Every change ships as a new version behind the same endpoint.",
    primary: { label: "Start free", href: AGENT_STUDIO.url },
    secondary: { label: "See use cases", href: "#use-cases" },
    trust: "7-day free trial · One agent · No card required",
    audience: ["Product teams shipping an AI feature", "Agencies building agents for clients", "Support and ops leads", "Developers who skip the orchestration layer"],
  },
  useCases: {
    heading: "Agents people build in Agent Studio",
    intro:
      "Every agent is the same shape: an orchestrator that talks to the caller, sub-agents it delegates to, and the guardrails that keep it on the job. Here is what that looks like in practice.",
    items: [
      {
        tag: "Support",
        title: "Support copilot with an order tracker",
        body: "The orchestrator answers customers; an Order Tracker sub-agent looks up shipping status. A guardrail keeps it on topic and the shield blocks jailbreak attempts.",
        flow: ["Message in", "Shield: pass", "Guardrail: on topic", "Delegate → Order Tracker", "Answer with trace"],
      },
      {
        tag: "Knowledge",
        title: "Internal knowledge assistant",
        body: "Answers policy and process questions for staff. An output guardrail rewrites anything that leaks confidential detail, and every answer carries its trace.",
        flow: ["Staff question", "Input guardrail", "Orchestrator answers", "Output guardrail: rewrite", "Logged with tokens"],
      },
      {
        tag: "Sales",
        title: "Lead qualification agent behind a form",
        body: "Call the agent from your website form. It asks two follow-up questions, scores the lead and returns structured output your CRM can store.",
        flow: ["POST /invoke", "Qualify sub-agent", "Score + reason", "JSON back to the form"],
      },
      {
        tag: "Content",
        title: "Brand-safe marketing assistant",
        body: "Drafts posts and replies inside a natural-language brand policy. Off-brand output is rewritten to comply rather than blocked.",
        flow: ["Brief in", "Writer sub-agent", "Brand guardrail: rewrite", "Draft out"],
      },
      {
        tag: "Operations",
        title: "Triage agent that routes to specialists",
        body: "One orchestrator reads the request and hands it to the right specialist: billing, technical, or account. Each specialist has its own model and prompt.",
        flow: ["Request", "Orchestrator plans", "Delegate → specialist", "Combined answer"],
      },
      {
        tag: "Agencies",
        title: "Twenty client agents on one account",
        body: "The Agency plan runs up to 20 agents with 20 sub-agents each. Every client gets its own endpoint, API key and version history.",
        flow: ["Client brief", "Design on canvas", "Deploy vN", "Rotate key per client"],
      },
    ],
  },
  steps: {
    heading: "Ten minutes from blank canvas to a live endpoint",
    intro: "No orchestration code, no prompt plumbing, no separate moderation service. The builder compiles your design into a runtime and hosts it.",
    items: [
      {
        title: "Design on the canvas",
        body: "Add an Orchestrator and connect Sub-agents for the work it should delegate. Write each prompt in plain words, then press Polish to turn it into a production-grade prompt.",
      },
      {
        title: "Add protection",
        body: "Drop in Guardrails with the policies your product needs and an Injection Shield that stops jailbreak attempts before the model sees them. Test it in the playground with a full trace.",
      },
      {
        title: "Deploy as an API",
        body: "One click compiles the design into a versioned deployment. Call it with a bearer key from any language. Change the design, deploy again, same URL.",
      },
    ],
  },
  features: {
    heading: "Everything a production agent needs, as nodes",
    intro: "Each building block is a node on the canvas. Connect them, test them, deploy them.",
    items: [
      { title: "Orchestrator", body: "Talks to the caller, decides what to do and delegates. Pick the model, set the step budget, write the prompt." },
      { title: "Sub-agents", body: "Specialists with their own model and prompt. Connect one to the orchestrator and it becomes a tool the orchestrator can call." },
      { title: "Guardrails", body: "Natural-language policies checked on input or output. Block with your own message, or rewrite the text to comply." },
      { title: "Injection shield", body: "Pattern rules, Meta's Llama Prompt Guard 2 and an LLM classifier. Optional hardening treats user input as data, never instructions." },
      { title: "Polish", body: "Turn a one-line idea into a structured system prompt or policy. Preview, then accept or discard." },
      { title: "Deploy and trace", body: "Versioned, immutable deployments, per-agent API keys with rotation, and a stage-by-stage trace on every run with latency and token usage." },
      { title: "Open models on Groq", body: "GPT-OSS 120B and 20B, Llama 3.3 70B, Llama 4 Maverick and Kimi K2, all served by Groq for low latency. Choose a model per node." },
      { title: "One stable endpoint", body: "Send a message or a whole conversation. Get back the answer, whether a guardrail or the shield blocked it, and the trace that explains why." },
    ],
  },
  comparison: {
    heading: "Agent Studio vs OpenAI Agent Builder, Copilot Studio, Dify and Flowise",
    intro:
      "Most agent builders assume you will bring hosting, a moderation layer or a specific vendor's models. Agent Studio ships the whole pipeline, shield to trace, behind one URL.",
    competitors: ["OpenAI Agent Builder", "Microsoft Copilot Studio", "Dify", "Flowise / Langflow"],
    rows: [
      {
        label: "How you build",
        cells: [
          "Canvas of orchestrator, sub-agents, guardrails and shield; prompts in plain words with Polish",
          "Visual canvas in the OpenAI platform",
          "Low-code builder inside the Microsoft 365 ecosystem",
          "Open-source visual LLM app builder with workflow canvas",
          "Open-source node graphs of LangChain-style components",
        ],
      },
      {
        label: "Models",
        cells: [
          "GPT-OSS, Llama 3.3, Llama 4 Maverick and Kimi K2 on Groq, chosen per node",
          "OpenAI models",
          "Microsoft-hosted models",
          "Many providers, bring your own keys",
          "Many providers, bring your own keys",
        ],
      },
      {
        label: "Guardrails",
        cells: [
          "Natural-language input and output policies that block or rewrite, built in",
          "Guardrail options available",
          "Enterprise governance and policy controls",
          "Moderation features available",
          "Assemble your own from components",
        ],
      },
      {
        label: "Prompt-injection defence",
        cells: [
          "Three layers built in: pattern rules, Llama Prompt Guard 2 and an LLM classifier, with optional hardening; every decision in the trace",
          "Safety checks available as guardrails",
          "Platform-level protections",
          "Add a moderation step yourself",
          "Add it yourself",
        ],
      },
      {
        label: "Hosting and deployment",
        cells: [
          "Fully hosted; one click deploys a versioned API with a bearer key",
          "Hosted by OpenAI; consumed through their APIs and SDKs",
          "Hosted by Microsoft; published to Teams, web and other channels",
          "Self-host, or their cloud",
          "Self-host, or their cloud",
        ],
      },
      {
        label: "Observability",
        cells: [
          "Stage-by-stage trace, latency and token usage on every call, returned with the response",
          "Tracing in the OpenAI platform",
          "Analytics in the Microsoft admin experience",
          "Logs and annotations in the app",
          "Depends on your setup",
        ],
      },
      {
        label: "Pricing model",
        cells: [
          "Flat monthly plans from $10 after a 7-day free trial",
          "Usage-based on OpenAI API pricing",
          "Per-message or capacity packs",
          "Free open source plus cloud plans",
          "Free open source plus cloud plans",
        ],
      },
      {
        label: "Best for",
        cells: [
          "Shipping a guarded agent as an API in minutes with no orchestration layer to maintain",
          "Teams standardised on OpenAI",
          "Organisations living in Microsoft 365",
          "Teams that want open-source control and self-hosting",
          "Developers experimenting with component graphs",
        ],
      },
    ],
    verdict:
      "Choose OpenAI Agent Builder or Copilot Studio when you are committed to that vendor's ecosystem. Choose Dify or Flowise when you want to self-host and assemble every piece. Choose Agent Studio when you want the shield, guardrails, orchestration, versioning and trace already wired, and a live endpoint before lunch.",
    note: "Competitor details are summarised from their public websites in September 2026 and simplified. Check each vendor for current features and pricing.",
  },
  pricing: {
    heading: "Flat monthly plans, in USD",
    intro: "Start with a 7-day free trial of one agent. Pick a plan when you are ready to keep it running. Change or cancel any time.",
    plans: [
      {
        name: "Free trial",
        price: "$0",
        period: "/month",
        blurb: "7 days, no card.",
        features: ["1 agent", "1 sub-agent per agent", "1 guardrail per agent", "Playground and traces"],
        cta: "Start free",
      },
      {
        name: "Starter",
        price: "$10",
        period: "/month",
        blurb: "One production agent.",
        features: ["1 agent", "1 sub-agent per agent", "1 guardrail per agent", "Email support"],
        cta: "Choose Starter",
      },
      {
        name: "Pro",
        price: "$25",
        period: "/month",
        blurb: "Two agents with richer teams.",
        features: ["2 agents", "2 sub-agents per agent", "2 guardrails per agent", "AI chat support"],
        cta: "Choose Pro",
        highlight: true,
      },
      {
        name: "Growth",
        price: "$49",
        period: "/month",
        blurb: "Three agents for a growing team.",
        features: ["3 agents", "3 sub-agents per agent", "3 guardrails per agent", "AI chat support"],
        cta: "Choose Growth",
      },
      {
        name: "Agency",
        price: "$200",
        period: "/month",
        blurb: "Build for many clients.",
        features: ["20 agents", "20 sub-agents per agent", "Unlimited guardrails per agent", "AI chat support"],
        cta: "Choose Agency",
      },
    ],
    note: "When a trial ends, the builder and deployed agents pause and nothing is deleted. Pick a plan and everything resumes as you left it.",
  },
  faqs: [
    {
      question: "What is Agent Studio?",
      answer:
        "Agent Studio is a visual AI agent builder. You design an orchestrator and its sub-agents on a canvas, add guardrails and a prompt-injection shield, test in a playground with a full trace, and deploy the agent as a versioned API with one click.",
    },
    {
      question: "Do I need to write code to build an AI agent?",
      answer:
        "No. You design on a canvas and write prompts in plain language. The only code is the one curl command you use to call your agent, and Agent Studio generates that for you.",
    },
    {
      question: "What is a sub-agent?",
      answer:
        "A specialist with its own prompt and model. When you connect it to the orchestrator, the orchestrator can hand it tasks and use the result, the way a lead hands work to a teammate.",
    },
    {
      question: "How does the injection shield work?",
      answer:
        "Three layers: fast pattern rules, Meta's Llama Prompt Guard 2 classifier, and a general LLM check. It can also harden your orchestrator so user text is treated as data. Every decision shows up in the trace.",
    },
    {
      question: "Which models can I use?",
      answer:
        "GPT-OSS 120B and 20B, Llama 3.3 70B, Llama 4 Maverick and Kimi K2, all served by Groq for low latency. You can choose a model per node.",
    },
    {
      question: "How do I call a deployed agent?",
      answer:
        "Every agent gets one endpoint that stays stable across versions. Send a message or a whole conversation with the agent's bearer API key and you get back the answer, whether a guardrail or the shield blocked it, and the trace that explains why. Keys can be rotated any time.",
    },
    {
      question: "How is Agent Studio different from OpenAI Agent Builder or Copilot Studio?",
      answer:
        "Those builders live inside one vendor's ecosystem and models. Agent Studio runs open models on Groq, ships guardrails and a three-layer prompt-injection shield as first-class nodes, and deploys every design as a versioned API with a trace on every call, on flat monthly pricing.",
    },
    {
      question: "How is it different from Dify, Flowise or Langflow?",
      answer:
        "Those are open-source builders you host and assemble yourself, including moderation. Agent Studio is fully hosted: the shield, guardrails, orchestration, versioning and tracing are already wired, so you go from blank canvas to a live endpoint in about ten minutes.",
    },
    {
      question: "What happens when my trial ends?",
      answer:
        "The builder and your deployed agents pause, and you get an email with a link to choose a plan. Nothing is deleted; pick a plan and everything resumes as you left it.",
    },
    {
      question: "Who builds and runs Agent Studio?",
      answer:
        "Agent Studio is designed, built and operated by Nishanthan Janarthanarajah, a full stack and AI engineer based in Colombo, Sri Lanka. It runs on Next.js and Vercel with Neon serverless Postgres, Groq for models, Google sign-in and Polar billing.",
    },
  ],
  related: {
    name: FLOWS.name,
    href: "/flows",
    blurb: "Need a business process to run itself rather than an agent behind an API? Describe it in plain English and Flows runs it around the clock.",
  },
  cta: {
    title: "Your first agent is ten minutes away",
    body: "Free for 7 days. No card. Bring one job you keep answering by hand and let an agent take it.",
  },
};
