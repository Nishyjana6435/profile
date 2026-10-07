import Link from "next/link";
import type { CSSProperties } from "react";
import type { SiteSettingsEntry } from "@/lib/contentful";
import type { HireLandingConfig } from "@/lib/marketing/ai-engineer-page";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import AgentScene from "@/components/AgentScene";
import Contact, { WHATSAPP_URL, WhatsAppIcon } from "@/components/Contact";
import FAQ from "@/components/FAQ";
import FlowsScene from "@/components/FlowsScene";
import Header from "@/components/Header";
import Reveal from "@/components/Reveal";
import { Btn } from "@/components/ui";

function withHighlight(text: string, highlight: string) {
  const index = text.indexOf(highlight);
  if (index === -1) return text;
  return (
    <>
      {text.slice(0, index)}
      <span className="text-shimmer">{text.slice(index, index + highlight.length)}</span>
      {text.slice(index + highlight.length)}
    </>
  );
}

function SectionHeading({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <Reveal as="p" variant="fade" className="text-xs uppercase tracking-[0.3em] text-brand-300/70">
        {eyebrow}
      </Reveal>
      <Reveal as="h2" delay={80} className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl">
        {title}
      </Reveal>
      {intro && (
        <Reveal as="p" delay={160} className="mt-4 text-sm leading-7 text-white/60">
          {intro}
        </Reveal>
      )}
    </div>
  );
}

function StructuredData({ P, email }: { P: HireLandingConfig; email?: string }) {
  const pageUrl = `${SITE_URL}/${P.slug}`;
  const graph = [
    {
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: P.seo.title,
      description: P.seo.description,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#person` },
      inLanguage: "en",
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${pageUrl}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: P.breadcrumb, item: pageUrl },
      ],
    },
    {
      "@type": "ProfessionalService",
      "@id": `${pageUrl}#service`,
      name: `${SITE_NAME} — AI Engineering`,
      url: pageUrl,
      description: P.seo.description,
      image: `${pageUrl}/opengraph-image`,
      email: email ? `mailto:${email}` : undefined,
      address: { "@type": "PostalAddress", addressLocality: "Colombo", addressCountry: "LK" },
      areaServed: P.areaServed.map((a) => ({ "@type": a.type, name: a.name })),
      founder: { "@id": `${SITE_URL}/#person` },
      provider: { "@id": `${SITE_URL}/#person` },
      knowsAbout: P.seo.keywords,
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "AI systems for business",
        itemListElement: [
          ...P.services.items.map((s) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: s.title, description: s.body, areaServed: "Sri Lanka" },
          })),
          ...P.products.items.map((p) => ({
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
            itemOffered: { "@id": `${p.url}#software` },
          })),
        ],
      },
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: SITE_NAME,
      url: SITE_URL,
      jobTitle: "AI Engineer and Full Stack Developer",
      address: { "@type": "PostalAddress", addressLocality: "Colombo", addressCountry: "LK" },
      hasOccupation: {
        "@type": "Occupation",
        name: "AI Engineer",
        occupationLocation: { "@type": "City", name: "Colombo, Sri Lanka" },
      },
      owns: P.products.items.map((p) => ({ "@id": `${p.url}#software` })),
    },
    ...P.products.items.map((p) => ({
      "@type": "SoftwareApplication",
      "@id": `${p.url}#software`,
      name: p.name,
      url: p.url,
      slogan: p.tagline,
      description: p.body,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      author: { "@id": `${SITE_URL}/#person` },
    })),
    {
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      mainEntity: P.faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
    { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: SITE_URL, name: SITE_NAME },
  ];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }) }}
    />
  );
}

export default function AiEngineerLanding({ config: P, siteSettings }: { config: HireLandingConfig; siteSettings: SiteSettingsEntry | null }) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#121212] text-white">
      <StructuredData P={P} email={siteSettings?.fields.contactEmail} />
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-clip px-6 pb-16 pt-16 sm:pt-24">
          <div aria-hidden="true" className="pointer-events-none absolute right-[-10%] top-0 h-[36rem] w-[36rem] rounded-full bg-brand-600/10 blur-[140px]" />
          <div aria-hidden="true" className="pointer-events-none absolute left-[-10%] top-1/2 h-[28rem] w-[40rem] rounded-full bg-brand-700/15 blur-[140px]" />
          <div className="relative mx-auto max-w-4xl">
            <nav aria-label="Breadcrumb" className="text-xs text-white/60">
              <ol className="flex items-center gap-2">
                <li><Link href="/" className="hover:text-white">Home</Link></li>
                <li aria-hidden="true">/</li>
                <li className="text-white/70">{P.breadcrumb}</li>
              </ol>
            </nav>
            <Reveal as="p" variant="fade" delay={60} className="mt-6 inline-flex items-center gap-2.5 text-xs uppercase tracking-[0.25em] text-brand-300/70">
              <span className="relative flex h-2 w-2">
                <span className="fx-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400" />
                <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              {P.hero.eyebrow}
            </Reveal>
            <Reveal delay={120}>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.1] text-white sm:text-5xl lg:text-[3.4rem]">
                {withHighlight(P.hero.h1, P.hero.highlight)}
              </h1>
            </Reveal>
            <Reveal as="p" delay={200} className="mt-6 max-w-2xl text-base leading-8 text-white/65">
              {P.hero.sub}
            </Reveal>
            <Reveal delay={280} className="mt-8 flex flex-wrap items-center gap-3">
              <Btn href={WHATSAPP_URL} solid icon={<WhatsAppIcon />}>
                Chat on WhatsApp
              </Btn>
              <Btn href="#products">See my AI products</Btn>
              <Btn href="/hire">All services</Btn>
              <span className="basis-full text-xs text-white/60">{P.hero.trust}</span>
            </Reveal>
            <Reveal variant="fade" stagger delay={360} className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {P.hero.stats.map((s, i) => (
                <div key={s.label} style={{ "--i": i } as CSSProperties} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-2xl font-semibold text-white">{s.value}</p>
                  <p className="mt-1 text-xs leading-5 text-white/55">{s.label}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* Products */}
        <section id="products" className="scroll-mt-24 px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow="Ready today" title={P.products.heading} intro={P.products.intro} />
            <div className="mt-12 grid gap-10 lg:grid-cols-2">
              {P.products.items.map((p, i) => (
                <Reveal key={p.name} variant={i === 0 ? "tilt-left" : "tilt-right"} threshold={0.15} className="flex flex-col rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-brand-300/70">{p.fit}</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">{p.name}</h3>
                  <p className="mt-1 text-sm italic text-white/70">“{p.tagline}”</p>
                  <div className="my-8 px-4 sm:px-8">{p.scene === "flows" ? <FlowsScene /> : <AgentScene />}</div>
                  <p className="text-sm leading-7 text-white/60">{p.body}</p>
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-shine inline-flex items-center gap-2 rounded-full bg-brand-500 px-5 py-2.5 text-xs font-medium uppercase tracking-wide text-white shadow-[0_12px_40px_-12px_rgba(0,0,0,0.8)] transition-transform duration-300 hover:-translate-y-0.5"
                    >
                      Try {p.name} free ↗
                    </a>
                    <Link href={p.href} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-xs uppercase tracking-wide text-white/80 transition-all duration-300 hover:border-brand-400/60 hover:bg-brand-500/10 hover:text-white">
                      Use cases &amp; comparison
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="scroll-mt-24 px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow="Custom builds" title={P.services.heading} intro={P.services.intro} />
            <Reveal variant="fade" stagger delay={200} className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {P.services.items.map((s, i) => (
                <div key={s.title} style={{ "--i": i } as CSSProperties} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-400/40 hover:bg-brand-500/10">
                  <h3 className="text-base font-semibold text-white">{s.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/60">{s.body}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* Independent vs agency */}
        {P.whyIndependent && (
          <section className="px-6 py-20 sm:py-24">
            <div className="mx-auto max-w-6xl">
              <SectionHeading eyebrow="Engineer vs agency" title={P.whyIndependent.heading} intro={P.whyIndependent.intro} />
              <Reveal variant="fade" stagger delay={200} className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {P.whyIndependent.items.map((s, i) => (
                  <div key={s.title} style={{ "--i": i } as CSSProperties} className="rounded-3xl border border-white/5 bg-[#1a1a1a] p-6">
                    <h3 className="text-base font-semibold text-white">{s.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/60">{s.body}</p>
                  </div>
                ))}
              </Reveal>
            </div>
          </section>
        )}

        {/* Proof */}
        <section className="px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow="Track record" title={P.proof.heading} />
            <Reveal variant="fade" stagger delay={200} className="mt-12 grid gap-4 sm:grid-cols-2">
              {P.proof.items.map((s, i) => (
                <div key={s.title} style={{ "--i": i } as CSSProperties} className="rounded-3xl border border-white/5 bg-[#1a1a1a] p-6">
                  <h3 className="text-base font-semibold text-white">{s.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/60">{s.body}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* Process + locations */}
        <section className="px-6 py-20 sm:py-24">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <Reveal as="p" variant="fade" className="text-xs uppercase tracking-[0.3em] text-brand-300/70">Process</Reveal>
              <Reveal as="h2" delay={80} className="mt-4 text-3xl font-semibold text-white">{P.process.heading}</Reveal>
              <Reveal as="ul" variant="fade" stagger delay={160} className="mt-8 flex flex-col gap-4">
                {P.process.items.map((s, i) => (
                  <li key={s.title} style={{ "--i": i } as CSSProperties} className="flex gap-4">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-500 font-mono text-xs font-semibold text-white">0{i + 1}</span>
                    <span>
                      <span className="block text-sm font-semibold text-white">{s.title}</span>
                      <span className="mt-1 block text-sm leading-6 text-white/60">{s.body}</span>
                    </span>
                  </li>
                ))}
              </Reveal>
            </div>
            <Reveal variant="right" delay={120} className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
              <p className="text-xs uppercase tracking-[0.3em] text-brand-300/70">Locations</p>
              <h2 className="mt-4 text-2xl font-semibold text-white">{P.locations.heading}</h2>
              <p className="mt-4 text-sm leading-7 text-white/60">{P.locations.body}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {P.locations.places.map((place) => (
                  <li key={place} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70">{place}</li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        <FAQ items={P.faqs} />

        <section className="px-6 py-20 sm:py-24">
          <Reveal className="relative mx-auto max-w-6xl overflow-clip rounded-3xl border border-white/10 bg-[#1a1a1a] p-8 sm:p-12">
            <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-600/15 blur-3xl" />
            <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">{P.cta.title}</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/65">{P.cta.body}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Btn href={WHATSAPP_URL} solid icon={<WhatsAppIcon />}>
                Chat on WhatsApp
              </Btn>
              {siteSettings?.fields.contactEmail && (
                <Btn href={`mailto:${siteSettings.fields.contactEmail}`} external>Email me</Btn>
              )}
            </div>
          </Reveal>
        </section>
      </main>
      <Contact siteSettings={siteSettings} />
    </div>
  );
}
