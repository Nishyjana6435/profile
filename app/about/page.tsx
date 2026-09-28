import type { Metadata } from "next";
import Link from "next/link";
import Contact, { WHATSAPP_URL } from "@/components/Contact";
import Header from "@/components/Header";
import Reveal from "@/components/Reveal";
import { AGENT_STUDIO } from "@/lib/agent";
import { getExperienceItems, getProfile, getSiteSettings } from "@/lib/contentful";
import { FLOWS } from "@/lib/flows";
import { richTextToPlainText } from "@/lib/richtext";
import { FOUNDER_ROLES } from "@/lib/agent-view";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const revalidate = 60000;

const url = `${SITE_URL}/about`;
const title = "About Nishanthan Janarthanarajah (Nishy) — Founder of Agent Studio & Flows";
const description =
  "Nishanthan Janarthanarajah, known as Nishy, is the founder of Agent Studio and Flows and an AI engineer in Colombo, Sri Lanka. Founder bio, products, experience and how to work with him.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: url },
  openGraph: { type: "profile", title, description, url, siteName: SITE_NAME, firstName: "Nishanthan", lastName: "Janarthanarajah", username: "nishy" },
  twitter: { card: "summary_large_image", title, description },
};

const PRODUCTS = [
  { name: AGENT_STUDIO.name, tagline: AGENT_STUDIO.tagline, body: AGENT_STUDIO.description, url: AGENT_STUDIO.url, page: "/agent-studio" },
  { name: FLOWS.name, tagline: FLOWS.tagline, body: FLOWS.description, url: FLOWS.url, page: "/flows" },
];

export default async function AboutPage() {
  const [profile, experience, siteSettings] = await Promise.all([getProfile(), getExperienceItems(), getSiteSettings()]);
  const f = profile?.fields;
  const bio = richTextToPlainText(f?.bio);
  const avatar = f?.avatar && "fields" in f.avatar ? f.avatar : undefined;
  const avatarUrl = avatar?.fields.file?.url ? `https:${avatar.fields.file.url}` : undefined;
  const socials = (f?.socialLinks ?? siteSettings?.fields.socialLinks ?? []).map((l) => l.url);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": `${url}#webpage`,
        url,
        name: title,
        description,
        mainEntity: { "@id": `${SITE_URL}/#person` },
        isPartOf: { "@id": `${SITE_URL}/#website` },
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: SITE_NAME,
        alternateName: ["Nishy", "Nishy Jana"],
        givenName: "Nishanthan",
        familyName: "Janarthanarajah",
        url: SITE_URL,
        image: avatarUrl,
        jobTitle: ["Founder of Agent Studio and Flows", "AI Engineer", f?.title].filter(Boolean),
        description: bio || undefined,
        address: { "@type": "PostalAddress", addressLocality: "Colombo", addressCountry: "LK" },
        worksFor: f?.currentCompany ? { "@type": "Organization", name: f.currentCompany } : undefined,
        sameAs: [...socials, FLOWS.url, AGENT_STUDIO.url],
        owns: PRODUCTS.map((p) => ({ "@id": `${p.url}#software` })),
      },
      ...PRODUCTS.map((p) => ({
        "@type": "Organization",
        "@id": `${p.url}#organization`,
        name: p.name,
        url: p.url,
        description: p.body,
        founder: { "@id": `${SITE_URL}/#person` },
        foundingLocation: { "@type": "Place", name: "Colombo, Sri Lanka" },
      })),
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "About Nishy", item: url },
        ],
      },
    ],
  };

  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#0a0514] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main className="relative flex-1 overflow-hidden px-6 pb-20 pt-16">
        <div aria-hidden="true" className="pointer-events-none absolute left-[-10%] top-0 h-[32rem] w-[40rem] rounded-full bg-violet-700/20 blur-[140px]" />
        <article className="relative mx-auto max-w-4xl">
          <nav aria-label="Breadcrumb" className="text-xs text-white/40">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-white/70">About</li>
            </ol>
          </nav>
          <Reveal as="p" variant="fade" className="mt-6 text-xs uppercase tracking-[0.3em] text-violet-300/70">Founder · AI engineer · Colombo, Sri Lanka</Reveal>
          <Reveal delay={80}>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.1] sm:text-5xl">
              Nishanthan Janarthanarajah <span className="text-shimmer">(Nishy)</span>
            </h1>
          </Reveal>
          <Reveal as="p" delay={140} className="mt-3 text-xl text-white/80 sm:text-2xl">Founder of Agent Studio and Flows</Reveal>
          <Reveal as="p" delay={200} className="mt-6 text-base leading-8 text-white/70">
            I am Nishanthan Janarthanarajah, and most people call me Nishy. I founded{" "}
            <Link href="/agent-studio" className="text-violet-300 underline-offset-4 hover:underline">Agent Studio</Link>, a visual builder that
            deploys AI agents as an API, and <Link href="/flows" className="text-violet-300 underline-offset-4 hover:underline">Flows</Link>,
            which turns a plain-English description into a running workflow. I design, build and run both from Colombo, Sri Lanka.
          </Reveal>
          {bio && <Reveal as="p" delay={240} className="mt-4 text-sm leading-7 text-white/60">{bio}</Reveal>}

          <section className="mt-14" aria-labelledby="products-h">
            <h2 id="products-h" className="text-2xl font-semibold">Companies I founded</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {PRODUCTS.map((p) => (
                <div key={p.name} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                  <h3 className="text-xl font-semibold">{p.name}</h3>
                  <p className="mt-1 text-sm italic text-white/70">“{p.tagline}”</p>
                  <p className="mt-3 text-sm leading-6 text-white/60">{p.body}</p>
                  <div className="mt-5 flex flex-wrap gap-3 text-xs">
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2 font-medium uppercase tracking-wide">Open {p.name} ↗</a>
                    <Link href={p.page} className="rounded-full border border-white/15 px-4 py-2 uppercase tracking-wide text-white/80 hover:text-white">Use cases &amp; comparison</Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {(
            <section className="mt-14" aria-labelledby="exp-h">
              <h2 id="exp-h" className="text-2xl font-semibold">Career</h2>
              <ul className="mt-6 flex flex-col gap-3">
                {FOUNDER_ROLES.map((r) => (
                  <li key={r.title} className="rounded-2xl border border-violet-400/30 bg-violet-500/10 p-5">
                    <p className="text-sm font-semibold">{r.title}<span className="font-normal text-white/50"> · {r.period}</span></p>
                    <p className="mt-1.5 text-sm leading-6 text-white/65">{r.description}</p>
                  </li>
                ))}
                {experience.map((e) => (
                  <li key={e.sys.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-sm font-semibold">{e.fields.title}{e.fields.period ? <span className="font-normal text-white/50"> · {e.fields.period}</span> : null}</p>
                    <p className="mt-1.5 text-sm leading-6 text-white/60">{e.fields.description}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="mt-14 rounded-3xl border border-violet-400/30 bg-violet-500/10 p-8" aria-labelledby="work-h">
            <h2 id="work-h" className="text-2xl font-semibold">Work with Nishy</h2>
            <p className="mt-3 text-sm leading-7 text-white/70">
              Besides the products, I build custom AI agents, RAG assistants and workflow automation for businesses in Sri Lanka and worldwide.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-xs">
              <Link href="/build-ai-system-for-your-business" className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-5 py-2.5 font-medium uppercase tracking-wide">Build an AI system for your business</Link>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/15 px-5 py-2.5 uppercase tracking-wide text-white/80 hover:text-white">Chat on WhatsApp</a>
            </div>
          </section>
        </article>
      </main>
      <Contact siteSettings={siteSettings} />
    </div>
  );
}
