import type { Metadata } from "next";
import Link from "next/link";
import Contact from "@/components/Contact";
import Header from "@/components/Header";
import NewsPoster from "@/components/NewsPoster";
import { Btn } from "@/components/ui";
import Reveal from "@/components/Reveal";
import { getSiteSettings } from "@/lib/contentful";
import { AGENT_STUDIO_FLOWS_NEWS as N } from "@/lib/news";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const revalidate = 60000;

const url = `${SITE_URL}${N.path}`;

export const metadata: Metadata = {
  title: { absolute: N.seoTitle },
  description: N.description,
  alternates: { canonical: url },
  openGraph: { type: "article", title: N.seoTitle, description: N.description, url, siteName: SITE_NAME, publishedTime: N.date },
  twitter: { card: "summary_large_image", title: N.seoTitle, description: N.description },
};

export default async function Page() {
  const siteSettings = await getSiteSettings();
  const shareUrl = encodeURIComponent(url);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "NewsArticle",
        "@id": `${url}#article`,
        headline: N.title,
        description: N.description,
        datePublished: N.date,
        dateModified: N.date,
        image: [`${SITE_URL}${N.poster}`, `${url}/opengraph-image.png`],
        url,
        mainEntityOfPage: url,
        author: { "@id": `${SITE_URL}/#person`, "@type": "Person", name: SITE_NAME, url: SITE_URL },
        publisher: { "@id": `${SITE_URL}/#person` },
        about: [{ "@id": `${N.links.agentStudio}#software` }, { "@id": `${N.links.flows}#software` }],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "News", item: `${SITE_URL}/news/agent-studio-flows` },
          { "@type": "ListItem", position: 3, name: N.title, item: url },
        ],
      },
    ],
  };

  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#121212] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main className="relative flex-1 overflow-hidden px-6 pb-20 pt-16">
        <article className="relative mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div>
            <nav aria-label="Breadcrumb" className="text-xs text-white/40">
              <ol className="flex items-center gap-2">
                <li><Link href="/" className="hover:text-white">Home</Link></li>
                <li aria-hidden="true">/</li>
                <li className="text-white/70">News</li>
              </ol>
            </nav>
            <Reveal as="p" variant="fade" className="mt-6 inline-flex items-center gap-2.5 text-xs uppercase tracking-[0.25em] text-emerald-300/80">
              <span className="relative flex h-2 w-2">
                <span className="fx-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400" />
                <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              New · <time dateTime={N.date}>28 September 2026</time>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-4 text-4xl font-semibold leading-[1.1] sm:text-5xl">
                Agent Studio agents now run <span className="text-shimmer">inside Flows</span>
              </h1>
            </Reveal>
            <Reveal as="p" delay={160} className="mt-6 text-base leading-8 text-white/70">{N.intro}</Reveal>
            <Reveal as="p" delay={200} className="mt-3 text-base leading-8 text-white/70">
              Deploy an agent in <Link href="/agent-studio" className="text-brand-300 underline-offset-4 hover:underline">Agent Studio</Link>, turn on
              {" "}“Add this agent to Flows automatically”, and it shows up in <Link href="/flows" className="text-brand-300 underline-offset-4 hover:underline">Flows</Link> as a
              ready-to-use step.
            </Reveal>

            <Reveal as="ol" variant="fade" stagger delay={260} className="mt-10 flex flex-col gap-4">
              {N.steps.map((s, i) => (
                <li key={s.title} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-500 font-mono text-xs font-semibold">0{i + 1}</span>
                  <span>
                    <span className="block text-sm font-semibold">{s.title}</span>
                    <span className="mt-1 block text-sm leading-6 text-white/60">{s.body}</span>
                  </span>
                </li>
              ))}
            </Reveal>

            <Reveal delay={320} className="mt-8 rounded-2xl border border-brand-400/30 bg-brand-500/10 p-5">
              <p className="text-[11px] uppercase tracking-[0.2em] text-brand-300/80">Example workflow, no code</p>
              <ol className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                {N.example.map((step, i) => (
                  <li key={step} className="flex items-center gap-2">
                    <span className={`rounded-lg border px-3 py-1.5 ${i === 1 ? "border-brand-300/60 bg-brand-500/15" : "border-white/10 bg-[#1a1a1a]"}`}>{step}</span>
                    {i < N.example.length - 1 && <span aria-hidden="true" className="text-brand-400">→</span>}
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal as="ul" variant="fade" stagger delay={360} className="mt-8 grid gap-3 sm:grid-cols-3">
              {N.benefits.map((b) => (
                <li key={b.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <span className="block text-sm font-semibold">{b.title}</span>
                  <span className="mt-1.5 block text-xs leading-5 text-white/55">{b.body}</span>
                </li>
              ))}
            </Reveal>

            <Reveal delay={420} className="mt-10 flex flex-wrap items-center gap-3">
              <Btn href={N.links.agentStudio} solid>Build the agent</Btn>
              <Btn href={N.links.flows}>Let it work in Flows</Btn>
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`} target="_blank" rel="noopener noreferrer" className="label inline-flex items-center gap-2 border border-white/15 px-4 py-3 text-white/80 transition-all duration-300 hover:border-white/50 hover:text-white">
                Share on LinkedIn
              </a>
            </Reveal>
          </div>

          <Reveal variant="tilt-right" threshold={0.1} className="lg:sticky lg:top-24">
            <NewsPoster />
          </Reveal>
        </article>
      </main>
      <Contact siteSettings={siteSettings} />
    </div>
  );
}
