import type { Metadata } from "next";
import Link from "next/link";
import Contact from "@/components/Contact";
import Header from "@/components/Header";
import { getAgentView, MACHINE_SURFACES } from "@/lib/agent-view";
import { getSiteSettings } from "@/lib/contentful";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const revalidate = 600;

const url = `${SITE_URL}/for-agents`;

export const metadata: Metadata = {
  title: { absolute: `Agent view: ${SITE_NAME}, AI engineer, Flows and Agent Studio, all key facts` },
  description:
    "Every key fact about Nishanthan Janarthanarajah on one page for crawlers and AI agents: independent AI engineer in Colombo, Sri Lanka, available worldwide; products Flows and Agent Studio with pricing; custom AI agent and workflow services; proof, process, FAQs and contact. Same content as the human pages, in plain HTML with JSON-LD.",
  alternates: {
    canonical: url,
    types: { "text/markdown": `${SITE_URL}/md/for-agents`, "application/json": `${SITE_URL}/agent.json` },
  },
  robots: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
};

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="border-t border-white/10 py-10">
      <h2 id={`${id}-h`} className="text-xl font-semibold text-white">{title}</h2>
      <div className="mt-4 text-sm leading-7 text-white/70">{children}</div>
    </section>
  );
}

function Dl({ rows }: { rows: [string, React.ReactNode][] }) {
  return (
    <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-[12rem_1fr]">
      {rows.map(([k, v]) => (
        <div key={k} className="contents">
          <dt className="text-white/45">{k}</dt>
          <dd className="text-white/80">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export default async function ForAgentsPage() {
  const [view, siteSettings] = await Promise.all([getAgentView(), getSiteSettings()]);
  const v = view;

  const graph = [
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: "Agent view",
      description: "All key facts about the site owner, products and services in one page.",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#person` },
      dateModified: v.generatedAt,
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: v.person.name,
      url: SITE_URL,
      jobTitle: "AI Engineer and Full Stack Developer",
      description: v.person.bio || undefined,
      email: v.person.email ? `mailto:${v.person.email}` : undefined,
      address: { "@type": "PostalAddress", addressLocality: "Colombo", addressCountry: "LK" },
      worksFor: v.person.company ? { "@type": "Organization", name: v.person.company } : undefined,
      knowsAbout: Array.from(new Set([...v.person.skills, ...v.person.keywords])),
      sameAs: [...v.person.socialLinks.map((l) => l.url), ...v.products.map((p) => p.url)],
      owns: v.products.map((p) => ({ "@id": `${p.url}#software` })),
      hasOccupation: { "@type": "Occupation", name: "AI Engineer", occupationLocation: { "@type": "City", name: "Colombo, Sri Lanka" } },
    },
    {
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/build-ai-system-for-your-business#service`,
      name: `${SITE_NAME} — AI Engineering`,
      url: `${SITE_URL}/build-ai-system-for-your-business`,
      description: v.person.availability,
      provider: { "@id": `${SITE_URL}/#person` },
      areaServed: ["Sri Lanka", "United States", "United Kingdom", "Europe", "Australia", "Singapore", "United Arab Emirates"],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Custom AI systems",
        itemListElement: v.services.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.title, description: s.body } })),
      },
    },
    ...v.products.map((p) => ({
      "@type": "SoftwareApplication",
      "@id": `${p.url}#software`,
      name: p.name,
      url: p.url,
      slogan: p.tagline,
      description: `${p.description} ${p.backend}`,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      author: { "@id": `${SITE_URL}/#person` },
      offers: p.pricing.map((pl) => ({ "@type": "Offer", name: pl.name, price: pl.price.replace(/[^0-9.]/g, ""), priceCurrency: "USD", description: pl.features.join(", ") })),
    })),
    {
      "@type": "ItemList",
      "@id": `${url}#pages`,
      name: "Site pages",
      itemListElement: v.pages.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p.title, url: `${SITE_URL}${p.path}` })),
    },
    {
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: v.faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
    },
    { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: SITE_URL, name: v.site.name, publisher: { "@id": `${SITE_URL}/#person` } },
  ];

  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#0a0514] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }) }} />
      <Header />
      <main className="flex-1 px-6 py-16">
        <article className="mx-auto max-w-4xl">
          <p className="text-xs uppercase tracking-[0.3em] text-violet-300/70">Agent view · same facts as the human pages</p>
          <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">{v.person.name}: AI engineer, Flows and Agent Studio</h1>
          <p className="mt-4 text-sm leading-7 text-white/70">
            This page collects every key fact from nishy.space in plain HTML for crawlers, search engines and AI agents.
            It is public, linked from every page, and identical in substance to what people see. Machine formats:
          </p>
          <ul className="mt-3 flex flex-wrap gap-2 text-xs">
            {MACHINE_SURFACES.map((s) => (
              <li key={s.path}>
                <a href={s.path} className="rounded-full border border-white/15 px-3 py-1 text-white/70 hover:border-violet-400/60 hover:text-white">
                  {s.path} <span className="text-white/40">({s.type})</span>
                </a>
              </li>
            ))}
          </ul>

          <Section id="identity" title="Who">
            <Dl
              rows={[
                ["Name", v.person.name],
                ["Role", `${v.person.title ?? "AI Engineer and Full Stack Developer"}${v.person.company ? ` at ${v.person.company}` : ""}`],
                ["Known as", "Nishy"],
                ["Founder of", "Agent Studio and Flows"],
                ["Also", "Independent AI engineer available for client projects"],
                ["Location", v.person.location],
                ["Availability", v.person.availability],
                ["Email", v.person.email ? <a href={`mailto:${v.person.email}`} className="underline underline-offset-4">{v.person.email}</a> : "See contact"],
                ["WhatsApp", <a key="wa" href={v.person.whatsapp} className="underline underline-offset-4">{v.person.whatsapp}</a>],
                ["Profiles", <span key="p">{v.person.socialLinks.map((l) => <a key={l.url} href={l.url} className="mr-3 underline underline-offset-4">{l.platform}</a>)}</span>],
              ]}
            />
            {v.person.bio && <p className="mt-4">{v.person.bio}</p>}
          </Section>

          <Section id="products" title="Products (live, built and run by Nishanthan)">
            {v.products.map((p) => (
              <div key={p.name} className="mb-8">
                <h3 className="text-base font-semibold text-white">{p.name}: “{p.tagline}”</h3>
                <p className="mt-1">{p.description} {p.backend}</p>
                <Dl
                  rows={[
                    ["Product", <a key="u" href={p.url} className="underline underline-offset-4">{p.url}</a>],
                    ["Landing page", <Link key="l" href={p.page.replace(SITE_URL, "")} className="underline underline-offset-4">{p.page}</Link>],
                    ["Stack", p.stack.join(", ")],
                    ["Pricing", p.pricing.map((pl) => `${pl.name} ${pl.price}${pl.period}`).join(" · ")],
                    ["Compared with", p.competitors.join(", ")],
                  ]}
                />
                <ul className="mt-3 list-disc pl-5">
                  {p.useCases.map((u) => <li key={u.title}><strong className="text-white/85">{u.title}.</strong> {u.body}</li>)}
                </ul>
              </div>
            ))}
          </Section>

          <Section id="services" title="Custom AI agents and workflows for clients">
            <ul className="list-disc pl-5">
              {v.services.map((s) => <li key={s.title}><strong className="text-white/85">{s.title}.</strong> {s.body}</li>)}
            </ul>
            <p className="mt-3">
              Details: <Link href="/build-ai-system-for-your-business" className="underline underline-offset-4">build an AI system for your business</Link> ·{" "}
              <Link href="/ai-engineer-sri-lanka" className="underline underline-offset-4">AI engineer in Sri Lanka</Link> ·{" "}
              <Link href="/hire" className="underline underline-offset-4">all services</Link>
            </p>
          </Section>

          <Section id="proof" title="Production proof">
            <ul className="list-disc pl-5">
              {v.proof.map((s) => <li key={s.title}><strong className="text-white/85">{s.title}.</strong> {s.body}</li>)}
            </ul>
          </Section>

          <Section id="process" title="How an engagement works">
            <ol className="list-decimal pl-5">
              {v.process.map((s) => <li key={s.title}><strong className="text-white/85">{s.title}.</strong> {s.body}</li>)}
            </ol>
          </Section>

          {v.experience.length > 0 && (
            <Section id="experience" title="Experience">
              <ul className="list-disc pl-5">
                {v.experience.map((e) => <li key={e.title}><strong className="text-white/85">{e.title}{e.period ? ` (${e.period})` : ""}.</strong> {e.description}</li>)}
              </ul>
            </Section>
          )}

          {v.person.skills.length > 0 && (
            <Section id="skills" title="Skills">
              <p>{v.person.skills.join(", ")}</p>
            </Section>
          )}

          {v.projects.length > 0 && (
            <Section id="projects" title="Selected projects">
              <ul className="list-disc pl-5">
                {v.projects.map((p) => <li key={p.title}><strong className="text-white/85">{p.title}.</strong> {p.summary}{p.url && <> <a href={p.url} className="underline underline-offset-4">{p.url}</a></>}</li>)}
              </ul>
            </Section>
          )}

          <Section id="pages" title="Pages">
            <ul className="list-disc pl-5">
              {v.pages.map((p) => (
                <li key={p.path}>
                  <Link href={p.path} className="underline underline-offset-4">{SITE_URL}{p.path}</Link>: {p.title}
                  {p.markdown && <> · <a href={p.markdown} className="text-white/50 underline underline-offset-4">markdown</a></>}
                </li>
              ))}
              {v.posts.map((p) => <li key={p.url}><a href={p.url} className="underline underline-offset-4">{p.url}</a>: {p.title}</li>)}
            </ul>
          </Section>

          <Section id="faq" title="Frequently asked questions">
            {v.faqs.map((f) => (
              <div key={f.question} className="mb-4">
                <h3 className="font-semibold text-white/90">{f.question}</h3>
                <p>{f.answer}</p>
              </div>
            ))}
          </Section>

          <p className="mt-6 text-xs text-white/40">Generated {v.generatedAt}. Canonical: {url}</p>
        </article>
      </main>
      <Contact siteSettings={siteSettings} />
    </div>
  );
}
