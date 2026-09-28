/**
 * One data model for every machine-facing surface: /for-agents, /llms.txt,
 * /llms-full.txt, /agent.json and the markdown twins under /md/{slug}.
 * Everything here is public and identical to what humans see on the pages.
 */
import { AGENT_STUDIO } from "@/lib/agent";
import {
  getExperienceItems,
  getFeaturedProjects,
  getPosts,
  getProfile,
  getSiteSettings,
} from "@/lib/contentful";
import { faqItems, type FaqItem } from "@/lib/faq";
import { FLOWS } from "@/lib/flows";
import { AGENT_STUDIO_PAGE } from "@/lib/marketing/agent-studio-page";
import { AI_ENGINEER_PAGE, BUILD_AI_SYSTEM_PAGE, type HireLandingConfig } from "@/lib/marketing/ai-engineer-page";
import { FLOWS_PAGE } from "@/lib/marketing/flows-page";
import type { ProductPageConfig } from "@/lib/marketing/types";
import { richTextToPlainText } from "@/lib/richtext";
import { EXTRA_KEYWORDS, SITE_NAME, SITE_URL } from "@/lib/seo";

export const PRODUCT_PAGES: ProductPageConfig[] = [FLOWS_PAGE, AGENT_STUDIO_PAGE];
export const HIRE_PAGES: HireLandingConfig[] = [BUILD_AI_SYSTEM_PAGE, AI_ENGINEER_PAGE];

export const MACHINE_SURFACES = [
  { path: "/for-agents", type: "text/html", label: "Agent view: every key fact on one HTML page with full JSON-LD" },
  { path: "/llms.txt", type: "text/markdown", label: "Short summary for LLMs" },
  { path: "/llms-full.txt", type: "text/markdown", label: "Full site content as markdown" },
  { path: "/agent.json", type: "application/json", label: "Structured JSON of the same facts" },
  { path: "/sitemap.xml", type: "application/xml", label: "Sitemap" },
] as const;

export const MARKDOWN_TWINS: Record<string, string> = {
  "/": "/md/home",
  "/flows": "/md/flows",
  "/agent-studio": "/md/agent-studio",
  "/build-ai-system-for-your-business": "/md/build-ai-system-for-your-business",
  "/ai-engineer-sri-lanka": "/md/ai-engineer-sri-lanka",
  "/for-agents": "/md/for-agents",
};

export interface AgentView {
  generatedAt: string;
  site: { name: string; url: string; description?: string };
  person: {
    name: string;
    title?: string;
    company?: string;
    location: string;
    email?: string;
    bio: string;
    availability: string;
    skills: string[];
    keywords: string[];
    socialLinks: { platform: string; url: string }[];
    whatsapp: string;
  };
  products: {
    name: string;
    url: string;
    page: string;
    tagline: string;
    description: string;
    backend: string;
    stack: readonly string[];
    pricing: { name: string; price: string; period: string; features: string[] }[];
    useCases: { title: string; body: string }[];
    competitors: string[];
  }[];
  services: { title: string; body: string }[];
  proof: { title: string; body: string }[];
  process: { title: string; body: string }[];
  experience: { title: string; company?: string; role?: string; period?: string; description: string; stack?: string[] }[];
  projects: { title: string; summary?: string; url?: string; tags?: string[] }[];
  posts: { title: string; url: string; publishDate: string }[];
  pages: { path: string; title: string; description: string; markdown: string }[];
  faqs: FaqItem[];
}

export async function getAgentView(): Promise<AgentView> {
  const [profile, siteSettings, experience, projects, posts] = await Promise.all([
    getProfile(),
    getSiteSettings(),
    getExperienceItems(),
    getFeaturedProjects(),
    getPosts(),
  ]);
  const f = profile?.fields;
  const socialLinks = (f?.socialLinks ?? siteSettings?.fields.socialLinks ?? []).map((l) => ({
    platform: l.platform,
    url: l.url,
  }));

  const pages: AgentView["pages"] = [
    {
      path: "/",
      title: `${f?.name ?? SITE_NAME}: AI engineer and full stack developer`,
      description: "Profile, both products, tool kits, experience and contact.",
      markdown: MARKDOWN_TWINS["/"],
    },
    ...PRODUCT_PAGES.map((p) => ({
      path: `/${p.slug}`,
      title: p.seo.title,
      description: p.seo.description,
      markdown: MARKDOWN_TWINS[`/${p.slug}`],
    })),
    ...HIRE_PAGES.map((p) => ({
      path: `/${p.slug}`,
      title: p.seo.title,
      description: p.seo.description,
      markdown: MARKDOWN_TWINS[`/${p.slug}`],
    })),
    { path: "/news/agent-studio-flows", title: "News (2026-09-28): Agent Studio agents now run inside Flows automatically", description: "One switch in the Deploy dialog adds an agent to Flows as a workflow step.", markdown: "" },
    { path: "/about", title: "About Nishanthan Janarthanarajah (Nishy), founder of Agent Studio and Flows", description: "Founder bio, products, experience and links.", markdown: "" },
    { path: "/hire", title: "Hire me: services, engagement types and FAQ", description: "All services with engagement types.", markdown: "" },
    { path: "/blog", title: "Blog", description: "Engineering articles.", markdown: "" },
    { path: "/for-agents", title: "Agent view", description: "Every key fact on one page for crawlers and AI agents.", markdown: MARKDOWN_TWINS["/for-agents"] },
  ];

  const allFaqs = dedupe([
    ...faqItems,
    ...BUILD_AI_SYSTEM_PAGE.faqs,
    ...AI_ENGINEER_PAGE.faqs,
    ...FLOWS_PAGE.faqs,
    ...AGENT_STUDIO_PAGE.faqs,
  ]);

  return {
    generatedAt: new Date().toISOString(),
    site: { name: siteSettings?.fields.siteTitle ?? SITE_NAME, url: SITE_URL, description: siteSettings?.fields.siteDescription },
    person: {
      name: f?.name ?? SITE_NAME,
      title: f?.title,
      company: f?.currentCompany,
      location: f?.location ?? "Colombo, Sri Lanka",
      email: siteSettings?.fields.contactEmail ?? f?.email,
      bio: richTextToPlainText(f?.bio),
      availability:
        "Accepting new client projects: custom AI agents, workflow automation, RAG assistants, AI features and MCP servers. Remote-first from Colombo, Sri Lanka, with overlap for US, UK, European and Asia-Pacific hours. Replies within a day.",
      skills: f?.skills ?? [],
      keywords: EXTRA_KEYWORDS,
      socialLinks,
      whatsapp: "https://wa.me/94777125043",
    },
    products: PRODUCT_PAGES.map((p) => {
      const base = p.slug === "flows" ? FLOWS : AGENT_STUDIO;
      return {
        name: p.name,
        url: p.url,
        page: `${SITE_URL}/${p.slug}`,
        tagline: p.tagline,
        description: base.description,
        backend: base.backend,
        stack: base.stack,
        pricing: p.pricing.plans.map((pl) => ({ name: pl.name, price: pl.price, period: pl.period, features: pl.features })),
        useCases: p.useCases.items.map((u) => ({ title: u.title, body: u.body })),
        competitors: p.comparison.competitors,
      };
    }),
    services: BUILD_AI_SYSTEM_PAGE.services.items,
    proof: BUILD_AI_SYSTEM_PAGE.proof.items,
    process: BUILD_AI_SYSTEM_PAGE.process.items,
    experience: experience.map((e) => ({
      title: e.fields.title,
      company: e.fields.company,
      role: e.fields.role,
      period: e.fields.period,
      description: e.fields.description,
      stack: e.fields.stack,
    })),
    projects: projects.map((p) => ({
      title: p.fields.title,
      summary: p.fields.summary || richTextToPlainText(p.fields.description) || undefined,
      url: p.fields.liveUrl,
      tags: p.fields.tags,
    })),
    posts: posts.map((p) => ({ title: p.fields.title, url: `${SITE_URL}/blog/${p.fields.slug}`, publishDate: p.fields.publishDate })),
    pages,
    faqs: allFaqs,
  };
}

function dedupe(items: FaqItem[]): FaqItem[] {
  const seen = new Set<string>();
  return items.filter((i) => {
    const k = i.question.toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

/* ---------- Markdown renderers ---------- */

const h = (level: number, text: string) => `${"#".repeat(level)} ${text}\n`;
const li = (items: string[]) => items.map((i) => `- ${i}`).join("\n") + "\n";

export function productPageMarkdown(p: ProductPageConfig): string {
  const out: string[] = [];
  out.push(h(1, `${p.name}: ${p.tagline}`));
  out.push(`> ${p.seo.description}\n`);
  out.push(`- Product: ${p.url}\n- Landing page: ${SITE_URL}/${p.slug}\n- Built and run by: ${SITE_NAME} (${SITE_URL})\n`);
  out.push(h(2, "Who it is for"));
  out.push(li(p.hero.audience));
  out.push(h(2, p.useCases.heading));
  out.push(p.useCases.intro + "\n");
  for (const u of p.useCases.items) out.push(`### ${u.title}\n${u.body}\n\nFlow: ${u.flow.join(" → ")}\n`);
  out.push(h(2, p.steps.heading));
  out.push(p.steps.items.map((s, i) => `${i + 1}. **${s.title}**: ${s.body}`).join("\n") + "\n");
  out.push(h(2, p.features.heading));
  out.push(li(p.features.items.map((f) => `**${f.title}**: ${f.body}`)));
  out.push(h(2, p.comparison.heading));
  out.push(p.comparison.intro + "\n");
  const cols = ["Criteria", p.name, ...p.comparison.competitors];
  out.push(`| ${cols.join(" | ")} |\n| ${cols.map(() => "---").join(" | ")} |`);
  for (const r of p.comparison.rows) out.push(`| ${r.label} | ${r.cells.join(" | ")} |`);
  out.push("\n" + p.comparison.verdict + "\n\n_" + p.comparison.note + "_\n");
  out.push(h(2, p.pricing.heading));
  out.push(p.pricing.intro + "\n");
  for (const pl of p.pricing.plans) out.push(`- **${pl.name}** ${pl.price}${pl.period}: ${pl.blurb} ${pl.features.join(", ")}.`);
  out.push("\n" + p.pricing.note + "\n");
  out.push(h(2, "FAQ"));
  for (const f of p.faqs) out.push(`### ${f.question}\n${f.answer}\n`);
  out.push(h(2, "Related"));
  out.push(`- ${p.related.name}: ${SITE_URL}${p.related.href}\n- Custom AI agents and workflows for clients: ${SITE_URL}/build-ai-system-for-your-business\n`);
  return out.join("\n");
}

export function hirePageMarkdown(p: HireLandingConfig): string {
  const out: string[] = [];
  out.push(h(1, p.hero.h1));
  out.push(`> ${p.seo.description}\n`);
  out.push(`- Page: ${SITE_URL}/${p.slug}\n- Availability: ${p.hero.trust}\n- Contact: WhatsApp https://wa.me/94777125043 · ${SITE_URL}/#contact\n`);
  out.push(p.hero.sub + "\n");
  out.push(li(p.hero.stats.map((s) => `${s.value} ${s.label}`)));
  out.push(h(2, p.products.heading));
  out.push(p.products.intro + "\n");
  for (const pr of p.products.items) out.push(`### ${pr.name}: ${pr.tagline}\n${pr.fit}. ${pr.body}\n\n- Try: ${pr.url}\n- Details: ${SITE_URL}${pr.href}\n`);
  out.push(h(2, p.services.heading));
  out.push(p.services.intro + "\n");
  out.push(li(p.services.items.map((s) => `**${s.title}**: ${s.body}`)));
  if (p.whyIndependent) {
    out.push(h(2, p.whyIndependent.heading));
    out.push(p.whyIndependent.intro + "\n");
    out.push(li(p.whyIndependent.items.map((s) => `**${s.title}**: ${s.body}`)));
  }
  out.push(h(2, p.proof.heading));
  out.push(li(p.proof.items.map((s) => `**${s.title}**: ${s.body}`)));
  out.push(h(2, p.process.heading));
  out.push(p.process.items.map((s, i) => `${i + 1}. **${s.title}**: ${s.body}`).join("\n") + "\n");
  out.push(h(2, p.locations.heading));
  out.push(p.locations.body + "\n\n" + li(p.locations.places));
  out.push(h(2, "FAQ"));
  for (const f of p.faqs) out.push(`### ${f.question}\n${f.answer}\n`);
  return out.join("\n");
}

export function agentViewMarkdown(view: AgentView, opts: { full: boolean }): string {
  const v = view;
  const out: string[] = [];
  out.push(h(1, `${v.person.name} (Nishy): founder of Agent Studio and Flows`));
  out.push(`> ${v.person.title ?? "AI engineer and full stack developer"}${v.person.company ? ` at ${v.person.company}` : ""} · ${v.person.location}\n`);
  out.push(`Independent AI engineer building AI agents, RAG assistants and workflow automation for businesses in Sri Lanka and worldwide, and creator of two live AI products, ${FLOWS.name} and ${AGENT_STUDIO.name}.\n`);
  out.push(`**Availability:** ${v.person.availability}\n`);
  if (v.person.bio) out.push(v.person.bio + "\n");
  out.push(h(2, "Machine-readable surfaces"));
  out.push(li(MACHINE_SURFACES.map((s) => `${SITE_URL}${s.path} (${s.type}): ${s.label}`)));
  out.push(`Every marketing page also has a markdown twin: request it with \`Accept: text/markdown\` or open the /md/ path listed under Pages.\n`);
  out.push(h(2, "Products"));
  for (const p of v.products) {
    out.push(`### ${p.name}: ${p.tagline}\n${p.description} ${p.backend}\n\n- Product: ${p.url}\n- Landing page: ${p.page}\n- Stack: ${p.stack.join(", ")}\n- Pricing: ${p.pricing.map((pl) => `${pl.name} ${pl.price}${pl.period}`).join(" · ")}\n- Compared with: ${p.competitors.join(", ")}\n`);
    if (opts.full) out.push(li(p.useCases.map((u) => `${u.title}: ${u.body}`)));
  }
  out.push(h(2, "Custom services"));
  out.push(li(v.services.map((s) => `**${s.title}**: ${s.body}`)));
  out.push(h(2, "Production proof"));
  out.push(li(v.proof.map((s) => `**${s.title}**: ${s.body}`)));
  if (opts.full) {
    out.push(h(2, "How an engagement works"));
    out.push(v.process.map((s, i) => `${i + 1}. **${s.title}**: ${s.body}`).join("\n") + "\n");
  }
  if (v.person.skills.length) {
    out.push(h(2, "Skills"));
    out.push(v.person.skills.join(", ") + "\n");
  }
  if (v.experience.length) {
    out.push(h(2, "Experience"));
    out.push(li(v.experience.map((e) => `**${e.title}**${e.period ? ` (${e.period})` : ""}: ${e.description}`)));
  }
  if (opts.full && v.projects.length) {
    out.push(h(2, "Projects"));
    out.push(li(v.projects.map((p) => `**${p.title}**${p.url ? ` (${p.url})` : ""}: ${p.summary ?? ""}`)));
  }
  out.push(h(2, "Pages"));
  out.push(li(v.pages.map((p) => `${SITE_URL}${p.path}${p.markdown ? ` (markdown: ${SITE_URL}${p.markdown})` : ""}: ${p.title}`)));
  if (opts.full && v.posts.length) {
    out.push(h(2, "Blog posts"));
    out.push(li(v.posts.map((p) => `${p.title}: ${p.url}`)));
  }
  out.push(h(2, "Frequently asked questions"));
  for (const f of opts.full ? v.faqs : v.faqs.slice(0, 12)) out.push(`### ${f.question}\n${f.answer}\n`);
  out.push(h(2, "Contact"));
  out.push(li([
    ...(v.person.email ? [`Email: ${v.person.email}`] : []),
    `WhatsApp: ${v.person.whatsapp}`,
    ...v.person.socialLinks.map((l) => `${l.platform}: ${l.url}`),
    `Website: ${SITE_URL}`,
  ]));
  if (opts.full) {
    out.push("\n---\n");
    for (const p of PRODUCT_PAGES) out.push(productPageMarkdown(p));
    for (const p of HIRE_PAGES) out.push(hirePageMarkdown(p));
  }
  return out.join("\n");
}

export async function pageMarkdown(slug: string): Promise<string | null> {
  const product = PRODUCT_PAGES.find((p) => p.slug === slug);
  if (product) return productPageMarkdown(product);
  const hire = HIRE_PAGES.find((p) => p.slug === slug);
  if (hire) return hirePageMarkdown(hire);
  if (slug === "home") return agentViewMarkdown(await getAgentView(), { full: false });
  if (slug === "for-agents") return agentViewMarkdown(await getAgentView(), { full: true });
  return null;
}
