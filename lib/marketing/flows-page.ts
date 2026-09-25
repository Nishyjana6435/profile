import { AGENT_STUDIO } from "@/lib/agent";
import { FLOWS } from "@/lib/flows";
import type { ProductPageConfig } from "./types";

export const FLOWS_PAGE: ProductPageConfig = {
  slug: "flows",
  name: FLOWS.name,
  url: FLOWS.url,
  host: FLOWS.host,
  tagline: FLOWS.tagline,
  scene: "flows",
  accent: "fuchsia",
  applicationCategory: "BusinessApplication",
  seo: {
    title: "Flows: Create Workflows Easily in Plain English | No-Code AI Workflow Automation",
    description:
      "Flows is AI workflow automation for small businesses and agencies. Describe a process in plain English and Flows builds the workflow, connects Slack, Google Sheets, Gmail, email, SMS and any REST API, runs it around the clock and fixes what breaks. 10 runs a month free, no card.",
    keywords: [
      "AI workflow automation",
      "create workflows easily",
      "no-code workflow automation",
      "plain English automation builder",
      "Zapier alternative for small business",
      "Make alternative",
      "n8n alternative hosted",
      "automate Slack Google Sheets Gmail",
      "business process automation tool",
      "agency automation platform",
      "lead capture automation",
      "AI lead qualification",
      "Flows by Nishy",
    ],
  },
  hero: {
    eyebrow: "AI workflow automation · no canvas, no nodes",
    h1: "Create workflows easily. Describe the process, Flows runs it.",
    highlight: "Describe the process, Flows runs it.",
    sub: "Say “when a lead fills the form, alert sales in Slack, log it in a sheet, and text me if it looks hot.” Flows connects your apps, drafts every step, runs it around the clock and tells you in one sentence when something needs you.",
    primary: { label: "Start free", href: FLOWS.url },
    secondary: { label: "See use cases", href: "#use-cases" },
    trust: "10 runs a month free · No card required · Built and run by an engineer, not a marketplace",
    audience: ["Small businesses", "Agencies running client playbooks", "Founders without an ops team", "Sales and support teams"],
  },
  useCases: {
    heading: "What people automate with Flows",
    intro:
      "These are the workflows agencies set up for every client. Each one is a plain-English brief that Flows turns into a running process in about ten minutes.",
    items: [
      {
        tag: "Lead capture",
        title: "Website lead → alert you, thank them",
        body: "The lead is in your inbox and Slack within seconds, and the prospect gets an instant thank-you written in your voice.",
        flow: ["Form submitted", "Alert #sales", "Append to Leads sheet", "Send thank-you email"],
      },
      {
        tag: "AI qualification",
        title: "Claude reads each enquiry and flags the hot ones",
        body: "Every enquiry is scored hot, warm or cold. Only hot leads interrupt you, with the reason and a suggested reply.",
        flow: ["Form submitted", "Claude scores the lead", "If hot: SMS the owner", "Log score in sheet"],
      },
      {
        tag: "Reporting",
        title: "Daily morning digest, written for you",
        body: "Every weekday at 8am, pull yesterday's numbers from any API and get a five-line briefing in your inbox.",
        flow: ["Schedule 8am", "Fetch metrics via REST API", "Claude writes the brief", "Email the team"],
      },
      {
        tag: "Revenue",
        title: "Failed payment → recover it politely",
        body: "A friendly retry link goes out straight away, and you get a reminder a day later if the invoice is still open.",
        flow: ["Payment failed webhook", "Email retry link", "Wait one day", "Remind the owner"],
      },
      {
        tag: "Agencies",
        title: "One playbook, every client",
        body: "Set up onboarding, reporting and lead routing once, then reuse it across client workspaces on the Agency plan.",
        flow: ["New client row in sheet", "Create Slack channel", "Send welcome pack", "Schedule first report"],
      },
      {
        tag: "Support",
        title: "Triage the support inbox",
        body: "New tickets are summarised, tagged by urgency and routed to the right person, so nobody reads every email twice.",
        flow: ["Email received", "Claude summarises and tags", "Post to #support", "Urgent: SMS on-call"],
      },
    ],
  },
  steps: {
    heading: "Ten minutes from idea to running",
    intro: "No canvas, no nodes, no field mapping by hand. The assistant does the tedious part and shows you a plain list you can read.",
    items: [
      {
        title: "Connect your apps",
        body: "Click Connect, approve in Slack or Google, done. Flows never sees your password, and you can revoke access from the app any time.",
      },
      {
        title: "Describe the process",
        body: "Write it the way you would brief a new hire. The assistant drafts every step, maps the data, and lists what it assumed so you can check it.",
      },
      {
        title: "Turn it on",
        body: "Run a test with real data, then flip the switch. It runs on our servers around the clock. You only hear from us when something needs you.",
      },
    ],
  },
  features: {
    heading: "Built for the business owner, not the ops engineer",
    intro: "Big automation tools give you thousands of integrations and a blank canvas. You need your five apps, the workflows your industry actually runs, and someone to tell you when they break.",
    items: [
      { title: "Plain English in, running workflow out", body: "Describe it once. Flows drafts the steps, wires the apps and shows you a readable list, not a diagram." },
      { title: "One run is one task", body: "However many steps it has. No per-step metering and no surprise bill when you add a Slack message." },
      { title: "Claude fixes what breaks", body: "When a run fails, the assistant reads the error and the data, explains it in one sentence and offers the fix. Temporary errors retry on their own." },
      { title: "Quiet by default", body: "Email, or SMS on paid plans, only when something needs you. Not a notification for every run." },
      { title: "The tools small teams already use", body: "Slack, Google Sheets, Gmail, built-in email and SMS, HTTP requests and any REST API with an API key." },
      { title: "Your tokens, encrypted", body: "Every app credential is AES-256 encrypted at rest, never shown again after connection, and revocable from the vendor's side in one click." },
      { title: "Templates that already work", body: "Lead capture, AI lead scoring, daily digests and failed-payment recovery ship as playbooks. Pick one, adjust two details, turn it on." },
      { title: "Durable history", body: "Every flow, run and log is stored in Neon serverless Postgres, so history survives restarts and is always queryable." },
    ],
  },
  comparison: {
    heading: "Flows vs Zapier, Make and n8n",
    intro:
      "The big automation platforms are excellent at breadth. Flows is built for a different job: a business owner or agency with a handful of apps who wants the process running today, without learning a canvas.",
    competitors: ["Zapier", "Make", "n8n"],
    rows: [
      {
        label: "How you build",
        cells: [
          "Describe the process in plain English; review a readable step list",
          "Visual editor of triggers and actions, plus an AI builder",
          "Visual scenario canvas of connected modules",
          "Node-based canvas, code-friendly, expressions and custom nodes",
        ],
      },
      {
        label: "What you pay for",
        cells: [
          "One run is one task, however many steps",
          "Tasks: each action step counts",
          "Operations: each module execution counts",
          "Workflow executions on cloud plans; self-hosted community edition is free",
        ],
      },
      {
        label: "When something breaks",
        cells: [
          "Claude explains the failure in one sentence and offers a fix; temporary errors retry automatically",
          "Run history, error alerts and replay tools; you diagnose",
          "Execution logs and error handlers you configure",
          "Execution logs, retry settings and error workflows you build",
        ],
      },
      {
        label: "Integrations",
        cells: [
          "Slack, Google Sheets, Gmail, email, SMS, HTTP and any REST API",
          "Thousands of app integrations",
          "Thousands of app integrations",
          "Hundreds of nodes plus a generic HTTP node",
        ],
      },
      {
        label: "AI in the product",
        cells: [
          "Claude drafts the workflow, scores leads, writes digests and repairs runs",
          "AI steps and agent features available",
          "AI modules available",
          "AI and LLM nodes available",
        ],
      },
      {
        label: "Hosting",
        cells: ["Fully hosted, runs around the clock", "Fully hosted", "Fully hosted", "Cloud or self-hosted"],
      },
      {
        label: "Free to start",
        cells: ["10 runs a month, no card", "Free plan available", "Free plan available", "Free self-hosted edition"],
      },
      {
        label: "Best for",
        cells: [
          "Owners and agencies with a few apps who want it running in ten minutes",
          "Teams that need the widest integration coverage",
          "Complex branching scenarios built visually",
          "Technical teams that want control or self-hosting",
        ],
      },
    ],
    verdict:
      "Pick Zapier or Make when you need a long-tail integration. Pick n8n when you want to self-host and write expressions. Pick Flows when you want to describe the process once and have it run, with an assistant that repairs it when it breaks.",
    note: "Competitor details are summarised from their public websites in September 2026 and simplified. Check each vendor for current features and pricing.",
  },
  pricing: {
    heading: "Flat monthly plans, one run is one task",
    intro: "Pick the plan that fits how much your business runs. Change or cancel any time; workflows pause instead of being deleted.",
    plans: [
      {
        name: "Free",
        price: "$0",
        period: "/month",
        blurb: "Try it on one real process.",
        features: ["10 runs a month", "2 active workflows", "3 connected apps", "No AI steps", "Email alerts"],
        cta: "Start free",
      },
      {
        name: "Starter",
        price: "$10",
        period: "/month",
        blurb: "For one business running its core automations.",
        features: ["2,000 runs a month", "10 active workflows", "10 connected apps", "AI steps included", "Email and SMS alerts"],
        cta: "Choose Starter",
      },
      {
        name: "Growth",
        price: "$49",
        period: "/month",
        blurb: "Multi-step flows with AI steps and SMS alerts.",
        features: ["10,000 runs a month", "50 active workflows", "30 connected apps", "AI steps included", "Email and SMS alerts"],
        cta: "Choose Growth",
        highlight: true,
      },
      {
        name: "Agency",
        price: "$200",
        period: "/month",
        blurb: "Run the same playbooks across all of your clients.",
        features: ["50,000 runs a month", "500 active workflows", "200 connected apps", "AI steps included", "Email and SMS alerts"],
        cta: "Choose Agency",
      },
    ],
    note: "Prices in USD, billed monthly. One run is one trigger firing once through all of its steps.",
  },
  faqs: [
    {
      question: "What is Flows?",
      answer:
        "Flows is an AI workflow automation platform for small businesses and agencies. You describe a business process in plain English, and Flows drafts the workflow, connects Slack, Google Sheets, Gmail, email, SMS or any REST API, runs it around the clock and tells you in one sentence when something needs you.",
    },
    {
      question: "Do I need to know how to code to create workflows?",
      answer:
        "No. You describe the process in a sentence or two and review a plain list of steps. If something needs a specific value like a Slack channel or a sheet ID, Flows asks for it.",
    },
    {
      question: "How is Flows different from Zapier or Make?",
      answer:
        "Zapier and Make give you thousands of integrations and a visual canvas, and charge per task or operation. Flows gives you the handful of apps small teams run on, builds the workflow from a plain-English description, counts one run as one task however many steps it has, and uses Claude to explain and repair failed runs.",
    },
    {
      question: "What counts as a run?",
      answer:
        "One trigger firing once, through all of its steps. A five-step workflow that fires 100 times is 100 runs, not 500.",
    },
    {
      question: "Which apps does Flows support?",
      answer:
        "Slack, Google Sheets, Gmail, built-in email and SMS, HTTP requests and any REST API with an API key. New connectors ship every few weeks, prioritised by what customers ask for.",
    },
    {
      question: "What happens when a workflow breaks?",
      answer:
        "You get an email, or an SMS on paid plans, with a one-sentence explanation from the assistant and usually a one-click fix. Runs retry automatically on temporary errors.",
    },
    {
      question: "Is my data safe?",
      answer:
        "App credentials are encrypted at rest with AES-256, never shown again after connection, and you can revoke access from Slack or Google at any time. Workflow data passes through Flows servers only while a run executes.",
    },
    {
      question: "Is there a free plan?",
      answer:
        "Yes. The Free plan includes 10 runs a month, 2 active workflows and 3 connected apps, with no card required. Paid plans start at $10 a month and add AI steps and SMS alerts.",
    },
    {
      question: "Can agencies use Flows for multiple clients?",
      answer:
        "Yes. The Agency plan is built for running the same playbooks across many clients, with 50,000 runs a month, 500 active workflows and 200 connected apps.",
    },
    {
      question: "Who builds and runs Flows?",
      answer:
        "Flows is designed, built and operated by Nishanthan Janarthanarajah, a full stack and AI engineer based in Colombo, Sri Lanka. It runs on Next.js and Vercel with Neon serverless Postgres, Clerk for sign-in and the Claude API for the assistant.",
    },
  ],
  related: {
    name: AGENT_STUDIO.name,
    href: "/agent-studio",
    blurb: "Need an AI agent behind an API rather than a workflow? Design it on a canvas with guardrails and deploy it in one click.",
  },
  cta: {
    title: "Your first workflow is ten minutes away",
    body: "Free for 10 runs a month. No card. Bring one process that eats your afternoon and let it run itself.",
  },
};
