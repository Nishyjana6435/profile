import { AGENT_STUDIO } from "@/lib/agent";
import type { FaqItem } from "@/lib/faq";
import { FLOWS } from "@/lib/flows";

export interface HireLandingConfig {
  slug: string;
  breadcrumb: string;
  seo: { title: string; description: string; keywords: string[] };
  hero: { eyebrow: string; h1: string; highlight: string; sub: string; trust: string; stats: { value: string; label: string }[] };
  products: { heading: string; intro: string; items: { name: string; tagline: string; scene: "flows" | "agent"; href: string; url: string; fit: string; body: string }[] };
  services: { heading: string; intro: string; items: { title: string; body: string }[] };
  whyIndependent?: { heading: string; intro: string; items: { title: string; body: string }[] };
  proof: { heading: string; items: { title: string; body: string }[] };
  process: { heading: string; items: { title: string; body: string }[] };
  locations: { heading: string; body: string; places: string[] };
  areaServed: { type: "Country" | "City" | "Continent"; name: string }[];
  faqs: FaqItem[];
  cta: { title: string; body: string };
  og: { byline: string; tagline: string; description: string };
}

const STATS = [
  { value: "7+", label: "years shipping production software" },
  { value: "2", label: "live AI products, built end to end" },
  { value: "6 → 31", label: "engineers scaled on one team" },
  { value: "Enterprise", label: "RAG and AI screening systems in production" },
];

const PRODUCTS: HireLandingConfig["products"] = {
  heading: "Two AI systems you can use today",
  intro:
    "Before you commission anything custom, see if one of my products already solves the job. Both are designed, built and run by me, and both are free to start.",
  items: [
    {
      name: FLOWS.name,
      tagline: FLOWS.tagline,
      scene: "flows",
      href: "/flows",
      url: FLOWS.url,
      fit: "For businesses that want a process to run itself",
      body: "Describe a process in plain English and Flows connects Slack, Google Sheets, Gmail, SMS and any REST API, runs it around the clock and repairs it with Claude when it breaks. 10 runs a month free.",
    },
    {
      name: AGENT_STUDIO.name,
      tagline: AGENT_STUDIO.tagline,
      scene: "agent",
      href: "/agent-studio",
      url: AGENT_STUDIO.url,
      fit: "For teams that need an AI agent behind an API",
      body: "Design an orchestrator and sub-agents on a canvas, add guardrails and a prompt-injection shield, and deploy as a versioned API in one click. 7-day free trial.",
    },
  ],
};

const SERVICES: HireLandingConfig["services"] = {
  heading: "Custom AI agents and workflows, built for your business",
  intro:
    "Products when they fit, custom builds when they don't. If Flows or Agent Studio does not cover your process, I design and build the agent, workflow, assistant or integration your business actually needs, on your data and your tools. Every engagement starts with a short discovery so we build the system that moves your numbers, not the one that sounds impressive.",
  items: [
    { title: "Custom AI agents that do real work", body: "Agents designed around your process: they plan, call your tools and finish the job, from intake and research to drafting and updating your systems, with approval gates so autonomous work stays safe." },
    { title: "RAG assistants over your data", body: "Assistants that answer from your documents, policies and databases with citations. Built in production on Azure AI Foundry and Azure OpenAI with Pinecone vector search and role-aware guardrails." },
    { title: "Custom workflow automation", body: "Lead capture, reporting, onboarding, support triage or whatever your team repeats every day, wired across the tools you already use. Delivered on Flows when it fits, or built bespoke with the integrations you need." },
    { title: "AI features inside your product", body: "Copilots, chat and generation features embedded in your Next.js or Node.js app, with prompt engineering, evaluation and content safety built in." },
    { title: "MCP servers and agent tooling", body: "Model Context Protocol servers that expose your CMS, design tools, APIs and codebase to AI agents. Proven on Figma design-to-code and headless CMS content automation." },
    { title: "AI discovery and proof of concept", body: "A short, fixed-scope engagement to find where AI actually pays off in your business, a working prototype, and a roadmap to production." },
  ],
};

const PROOF: HireLandingConfig["proof"] = {
  heading: "Work that already runs in production",
  items: [
    { title: "Enterprise RAG HR assistant", body: "Retrieval-Augmented Generation assistant on Azure AI Foundry with Pinecone vector search, re-ranking and role-based prompt guardrails, answering staff questions over internal policy." },
    { title: "AI interview and screening platform", body: "Candidate screening with LLM-as-a-judge scoring, structured rubrics and human review, built for a hiring team that needed consistency at volume." },
    { title: "PandaDoc marketing platform (US)", body: "Lead engineering for PandaDoc's B2B site on Next.js, Contentful and Vercel at Eight25media: SEO strategy, a Contentful–Smartling localization pipeline and dual-layer caching." },
    { title: "Paycor data migration and Modjoul IoT (US)", body: "Led the Snowflake migration of Paycor's on-prem client data, and architected secure AWS API Gateway and Cognito integrations for Modjoul's IoT asset-management platform." },
    { title: "Flows and Agent Studio", body: "Two AI products designed, built and operated end to end: Next.js on Vercel, Neon serverless Postgres, Claude and Groq models, with paying plans and free tiers." },
    { title: "Scaling a delivery team", body: "Promoted from Senior Engineer to Associate Technical Lead at Verdentra, directing staff augmentation for Paycor and growing the team from 6 to 31 engineers." },
  ],
};

const PROCESS: HireLandingConfig["process"] = {
  heading: "How an engagement works",
  items: [
    { title: "Talk", body: "A WhatsApp, email or video call about the job you want done. I tell you honestly whether AI is the right tool, and whether Flows or Agent Studio already covers it." },
    { title: "Discover", body: "A short, fixed-scope discovery: your data, your tools, the risks, and a prototype you can click." },
    { title: "Build", body: "Production build with evaluation, guardrails and monitoring, delivered in weekly increments you can see." },
    { title: "Run", body: "Handover with documentation, or I keep operating it for you. Either way you own the code and the data." },
  ],
};

export const AI_ENGINEER_PAGE: HireLandingConfig = {
  slug: "ai-engineer-sri-lanka",
  breadcrumb: "AI engineer in Sri Lanka",
  seo: {
    title: "AI Engineer in Sri Lanka: Build an AI System for Your Business | Nishanthan Janarthanarajah",
    description:
      "Looking for an AI engineer in Sri Lanka to build an AI system for your business? Nishanthan Janarthanarajah, Colombo, builds AI agents, RAG assistants and workflow automation for companies in Sri Lanka and worldwide, and runs two live AI products, Flows and Agent Studio, you can start using today.",
    keywords: [
      "AI engineer Sri Lanka",
      "best AI engineer in Sri Lanka",
      "hire AI engineer Sri Lanka",
      "AI developer Sri Lanka",
      "AI consultant Sri Lanka",
      "AI engineer Colombo",
      "AI developer Colombo",
      "AI engineer Jaffna",
      "build AI system for my business",
      "AI system for business Sri Lanka",
      "AI automation Sri Lanka",
      "AI agents for business Sri Lanka",
      "LLM developer Sri Lanka",
      "RAG developer Sri Lanka",
      "generative AI consultant Sri Lanka",
      "AI solutions company Sri Lanka",
      "chatbot developer Sri Lanka",
      "workflow automation Sri Lanka",
      "Flows",
      "Agent Studio",
    ],
  },
  hero: {
    eyebrow: "AI engineer · Colombo, Sri Lanka · remote worldwide",
    h1: "An AI engineer in Sri Lanka who builds AI systems for your business",
    highlight: "builds AI systems for your business",
    sub: "I am Nishanthan Janarthanarajah (Nishy), founder of Agent Studio and Flows, and a full stack and AI engineer with 7+ years shipping production software. I design and build AI agents, RAG assistants over your own data and workflow automation, and I run two live AI products, Flows and Agent Studio, that you can put to work today.",
    trust: "Based in Colombo · Working with clients in Sri Lanka, the US and Europe · Replies within a day",
    stats: [
      { value: "7+", label: "years shipping production software" },
      { value: "2", label: "live AI products, built end to end" },
      { value: "6 → 31", label: "engineers scaled on one team" },
      { value: "Enterprise", label: "RAG and AI screening systems in production" },
    ],
  },
  products: PRODUCTS,
  services: SERVICES,
  proof: PROOF,
  process: PROCESS,
  locations: {
    heading: "Where I work",
    body: "I am based in Colombo and work with businesses across Sri Lanka, including Jaffna, Kandy and Galle, as well as remote clients in the US, UK, Europe and Australia. Meetings in Colombo in person, everywhere else over video.",
    places: ["Colombo", "Jaffna", "Kandy", "Galle", "Remote · US", "Remote · UK & Europe", "Remote · Australia"],
  },
  areaServed: [
    { type: "Country", name: "Sri Lanka" },
    { type: "City", name: "Colombo" },
    { type: "City", name: "Jaffna" },
    { type: "City", name: "Kandy" },
    { type: "City", name: "Galle" },
    { type: "Country", name: "United States" },
    { type: "Country", name: "United Kingdom" },
    { type: "Country", name: "Australia" },
  ],
  faqs: [
    {
      question: "Who is the best AI engineer in Sri Lanka to build an AI system for my business?",
      answer:
        "There is no official ranking, so judge by what has actually shipped. Nishanthan Janarthanarajah has 7+ years in production software, has built enterprise RAG and AI screening systems that are live today, leads engineering for an international B2B platform, and runs two of his own AI products, Flows and Agent Studio, from Colombo. Ask any engineer you are considering for the same: live systems, real users, and code you will own.",
    },
    {
      question: "What kind of AI system can you build for a business in Sri Lanka?",
      answer:
        "AI agents that complete business processes, RAG assistants that answer from your own documents, workflow automation across Slack, Google Sheets, Gmail, SMS and REST APIs, AI features inside your product, and MCP servers that let agents use your existing tools. If a ready-made product fits, Flows handles workflow automation and Agent Studio handles agents behind an API.",
    },
    {
      question: "How much does it cost to build an AI system in Sri Lanka?",
      answer:
        "It depends on the data, the integrations and how much of the system already exists. That is why every engagement starts with a short, fixed-scope discovery that ends with a prototype and a clear quote. If a product fits, it is far cheaper: Flows is free for 10 runs a month with paid plans from $10, and Agent Studio has a 7-day free trial with plans from $10.",
    },
    {
      question: "Do I need to be in Colombo to work with you?",
      answer:
        "No. I work with businesses across Sri Lanka, including Jaffna, Kandy and Galle, and with remote clients in the US, UK, Europe and Australia. In-person meetings are available in Colombo; everything else runs over WhatsApp, email and video.",
    },
    {
      question: "Can a small business in Sri Lanka afford AI automation?",
      answer:
        "Yes. Most small businesses do not need a custom build. Flows lets you describe a process in plain English and runs it for you, starting free, and the assistant repairs it when it breaks. Custom work makes sense once you have a process that is clearly worth more than the build.",
    },
    {
      question: "Which AI models and platforms do you work with?",
      answer:
        "Azure AI Foundry and Azure OpenAI for enterprise work, the Claude API, open models such as GPT-OSS and Llama on Groq, Pinecone for vector search, and Next.js, Node.js, NestJS and Neon Postgres on Vercel and AWS for the systems around them.",
    },
    {
      question: "Do you build AI agents for companies in Sri Lanka?",
      answer:
        "Yes. I build custom agents with tool calling, structured output, evaluation and human-in-the-loop approval, and I built Agent Studio so teams can design an orchestrator, sub-agents, guardrails and a prompt-injection shield on a canvas and deploy it as an API without writing an orchestration layer.",
    },
    {
      question: "Will I own the AI system you build?",
      answer:
        "Yes. You own the code, the prompts, the data and the accounts. Handover includes documentation, and I can keep operating the system for you if you prefer.",
    },
    {
      question: "How do I get started?",
      answer:
        "Message me on WhatsApp or email with the job you want done. If a product already covers it, I will say so and point you to the free tier. If it needs custom work, we book a discovery call.",
    },
  ],
  cta: {
    title: "Tell me the job you want done",
    body: "One message is enough to start. I will tell you whether Flows or Agent Studio already covers it, or what a custom build would take.",
  },
  og: {
    byline: "AI engineer · Colombo, Sri Lanka",
    tagline: "AI systems for your business, built in Sri Lanka.",
    description: "AI agents, RAG assistants and workflow automation. Plus two live products: Flows and Agent Studio.",
  },
};

export const BUILD_AI_SYSTEM_PAGE: HireLandingConfig = {
  slug: "build-ai-system-for-your-business",
  breadcrumb: "Build an AI system for your business",
  seo: {
    title: "Hire an AI Engineer to Build an AI System for Your Business | Independent, Remote, Worldwide",
    description:
      "Need someone to build an AI system for your business? Nishanthan Janarthanarajah is an independent AI engineer who designs and ships AI agents, RAG assistants and workflow automation for companies in the US, UK, Europe, Australia and Asia, and runs two live AI products, Flows and Agent Studio. Accepting new client projects.",
    keywords: [
      "build an AI system for my business",
      "hire someone to build AI for my business",
      "AI engineer for hire",
      "freelance AI engineer",
      "independent AI consultant",
      "custom AI solutions for small business",
      "AI developer for startups",
      "AI agency alternative",
      "remote AI engineer",
      "LLM engineer for hire",
      "RAG consultant",
      "AI agent developer",
      "AI automation consultant",
      "generative AI engineer",
      "AI system architect",
      "Flows",
      "Agent Studio",
    ],
  },
  hero: {
    eyebrow: "Independent AI engineer · remote · overlapping US, UK, EU and Asia-Pacific hours",
    h1: "Need someone to build an AI system for your business? Hire the engineer, not the agency.",
    highlight: "Hire the engineer, not the agency.",
    sub: "I am Nishanthan Janarthanarajah (Nishy), founder of Agent Studio and Flows, and an independent AI and full stack engineer with 7+ years shipping production software for US and international clients. I design and build AI agents, RAG assistants over your own data and workflow automation, and I run two live AI products, Flows and Agent Studio, so you can see finished work before you hire me.",
    trust: "Accepting new client projects · Remote-first from Colombo, Sri Lanka · Replies within a day",
    stats: STATS,
  },
  products: PRODUCTS,
  services: SERVICES,
  whyIndependent: {
    heading: "Why businesses hire an independent AI engineer instead of an agency",
    intro:
      "Directories and vendor lists are built around agencies, so that is who you find first. For most AI systems, a single senior engineer who has shipped this before is the faster and more direct choice.",
    items: [
      { title: "You talk to the architect", body: "No account manager in between. The person who scopes the system designs it, builds it and answers your questions." },
      { title: "Weeks, not quarters", body: "A fixed-scope discovery, a prototype you can click, then weekly increments. Most first versions ship in weeks." },
      { title: "You own everything", body: "Code, prompts, data, cloud accounts. Handover includes documentation, and you can hire anyone to continue." },
      { title: "Proof you can try", body: "Flows and Agent Studio are live products with paying plans. You can test my judgement on AI systems before a single call." },
      { title: "Enterprise experience without the overhead", body: "I have led delivery for US B2B platforms and scaled a team from 6 to 31, so the process is professional without agency margin on every hour." },
      { title: "When an agency is the better fit", body: "Multi-team platform builds, 24/7 SLAs or procurement that requires a large vendor. In those cases I can also plug into your existing team as the AI lead." },
    ],
  },
  proof: PROOF,
  process: PROCESS,
  locations: {
    heading: "Where my clients are",
    body: "I work remotely from Colombo, Sri Lanka, with overlap for US mornings, full UK and European working days, and Australian and Asia-Pacific afternoons. Kick-off, weekly demos and handover all run over video, WhatsApp and email.",
    places: ["United States", "United Kingdom", "Europe", "Australia", "Singapore & Asia-Pacific", "Middle East", "Sri Lanka"],
  },
  areaServed: [
    { type: "Country", name: "United States" },
    { type: "Country", name: "United Kingdom" },
    { type: "Continent", name: "Europe" },
    { type: "Country", name: "Australia" },
    { type: "Country", name: "Singapore" },
    { type: "Country", name: "United Arab Emirates" },
    { type: "Country", name: "Sri Lanka" },
  ],
  faqs: [
    {
      question: "How do I hire someone to build an AI system for my business?",
      answer:
        "Start with the job, not the technology: which process costs you the most time or money. Then look for an engineer with live systems you can inspect, not slide decks. Message me with that job and I will tell you within a day whether an existing product covers it, or what a custom build would take.",
    },
    {
      question: "Should I hire an AI agency or an independent AI engineer?",
      answer:
        "Hire an agency for multi-team platform builds, 24/7 SLAs or procurement that requires a large vendor. Hire an independent engineer when you want to talk directly to the person designing the system, ship in weeks, and own the code without agency overhead. I also work as the AI lead inside existing teams when that fits better.",
    },
    {
      question: "How long does it take to build an AI system?",
      answer:
        "Discovery and a clickable prototype usually take one to two weeks. A production first version of an agent, RAG assistant or automation typically ships in a few more weeks, delivered in weekly increments. If Flows or Agent Studio already covers the job, you can be running the same day.",
    },
    {
      question: "How much does a custom AI system cost?",
      answer:
        "It depends on your data, integrations and how much already exists, which is why every engagement starts with a fixed-scope discovery that ends in a clear quote. Products are far cheaper: Flows starts free with plans from $10 a month, and Agent Studio has a 7-day free trial with plans from $10.",
    },
    {
      question: "Can you work in US or European time zones?",
      answer:
        "Yes. From Colombo I overlap with US mornings, the full UK and European working day, and Australian and Asia-Pacific afternoons. Weekly demos are scheduled in your hours.",
    },
    {
      question: "What if I only need a small automation, not a whole system?",
      answer:
        "Use Flows. Describe the process in plain English, connect Slack, Google Sheets, Gmail, SMS or any REST API, and it runs for you with 10 free runs a month. Custom work only makes sense once a process is clearly worth more than the build.",
    },
    {
      question: "Do you build AI agents with guardrails and prompt-injection protection?",
      answer:
        "Yes. Custom agents ship with evaluation, guardrails and human-in-the-loop approval, and Agent Studio lets your team design an orchestrator, sub-agents, guardrails and a three-layer injection shield on a canvas and deploy it as a versioned API.",
    },
    {
      question: "Which platforms and models do you use?",
      answer:
        "Azure AI Foundry and Azure OpenAI for enterprise work, the Claude API, open models such as GPT-OSS and Llama on Groq, Pinecone for vector search, and Next.js, Node.js, NestJS and Neon Postgres on Vercel and AWS around them. I choose per project, and you keep the accounts.",
    },
    {
      question: "Will I own the AI system after it is built?",
      answer:
        "Yes. You own the code, prompts, data and infrastructure. Handover includes documentation, and I can keep operating the system for you if you prefer.",
    },
    {
      question: "Where are you based and who have you worked with?",
      answer:
        "I am based in Colombo, Sri Lanka. I lead engineering for PandaDoc's B2B marketing platform at Eight25media, led Paycor's Snowflake data migration and Modjoul's IoT integrations at earlier employers, and have shipped an enterprise RAG assistant and an AI screening platform, all for US clients.",
    },
  ],
  cta: {
    title: "Tell me the job you want done",
    body: "One message is enough to start. I will tell you whether Flows or Agent Studio already covers it, or what a custom build would take, usually within a day.",
  },
  og: {
    byline: "Independent AI engineer · remote worldwide",
    tagline: "Hire the engineer, not the agency.",
    description: "AI agents, RAG assistants and workflow automation for businesses in the US, UK, Europe, Australia and Asia.",
  },
};
