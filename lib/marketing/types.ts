import type { FaqItem } from "@/lib/faq";

export interface ComparisonRow {
  label: string;
  /** First cell is this product, the rest follow `competitors` order. */
  cells: string[];
}

export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  blurb: string;
  features: string[];
  cta: string;
  highlight?: boolean;
}

export interface ProductPageConfig {
  slug: "flows" | "agent-studio";
  name: string;
  url: string;
  host: string;
  tagline: string;
  scene: "flows" | "agent";
  accent: "fuchsia" | "sky";
  applicationCategory: string;
  seo: { title: string; description: string; keywords: string[] };
  hero: {
    eyebrow: string;
    h1: string;
    highlight: string;
    sub: string;
    primary: { label: string; href: string };
    secondary: { label: string; href: string };
    trust: string;
    audience: string[];
  };
  useCases: { heading: string; intro: string; items: { tag: string; title: string; body: string; flow: string[] }[] };
  steps: { heading: string; intro: string; items: { title: string; body: string }[] };
  features: { heading: string; intro: string; items: { title: string; body: string }[] };
  comparison: {
    heading: string;
    intro: string;
    competitors: string[];
    rows: ComparisonRow[];
    verdict: string;
    note: string;
  };
  pricing: { heading: string; intro: string; plans: PricingPlan[]; note: string };
  faqs: FaqItem[];
  related: { name: string; href: string; blurb: string };
  cta: { title: string; body: string };
}
