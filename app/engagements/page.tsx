import type { Metadata } from "next";
import Link from "next/link";
import BookingForm from "@/components/BookingForm";
import Contact from "@/components/Contact";
import FAQ from "@/components/FAQ";
import Header from "@/components/Header";
import Reveal from "@/components/Reveal";
import { Btn, Eyebrow, Num } from "@/components/ui";
import { getSiteSettings } from "@/lib/contentful";
import { ENGAGEMENTS, ENGAGEMENT_FAQS, WORKING_TOGETHER } from "@/lib/engagements";
import { BUILD_AI_SYSTEM_PAGE } from "@/lib/marketing/ai-engineer-page";
import { firstSentence, pad } from "@/lib/text";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const revalidate = 60000;

const url = `${SITE_URL}/engagements`;
const title = "Engagements and pricing: discovery sprint, production build, operate";
const description = `How I work with clients and what it costs: a fixed-price discovery sprint from ${ENGAGEMENTS.currency} ${ENGAGEMENTS.shapes[0].from.toLocaleString("en-US")}, production builds in 3 to 8 weeks, and a monthly operate plan. Contracts, NDA, invoicing and paying from abroad, explained.`;

export const metadata: Metadata = {
  title: { absolute: `${title} — ${SITE_NAME}` },
  description,
  alternates: { canonical: url },
  openGraph: { title, description, url, siteName: SITE_NAME, type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default async function EngagementsPage() {
  const siteSettings = await getSiteSettings();
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": `${url}#webpage`, url, name: title, description, isPartOf: { "@id": `${SITE_URL}/#website` } },
      ...ENGAGEMENTS.shapes.map((s) => ({
        "@type": "Service",
        name: s.name,
        description: s.fit,
        provider: { "@id": `${SITE_URL}/#person` },
        areaServed: "Worldwide",
        offers: { "@type": "Offer", priceCurrency: ENGAGEMENTS.currency, price: s.from, priceSpecification: { "@type": "PriceSpecification", minPrice: s.from, priceCurrency: ENGAGEMENTS.currency, unitText: s.unit } },
      })),
      { "@type": "FAQPage", mainEntity: ENGAGEMENT_FAQS.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) },
    ],
  };

  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#121212] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main className="flex-1">
        <section className="border-b hairline px-6 pb-20 pt-14 sm:pt-20">
          <div className="mx-auto max-w-6xl">
            <nav aria-label="Breadcrumb" className="label text-neutral-500"><Link href="/" className="hover:text-white">Home</Link> / Engagements</nav>
            <div className="mt-8"><Eyebrow>Engagements · Pricing · How we work</Eyebrow></div>
            <h1 className="display mt-5 max-w-4xl text-4xl text-white sm:text-6xl">Three shapes of work, <span className="text-neutral-500">priced from the start.</span></h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-neutral-400">
              Vague pricing wastes everyone&apos;s time. These are the engagements I run, what each costs from, and how contracts, invoices and NDAs work. Every one starts with a short call that is free.
            </p>
          </div>
        </section>

        <section className="border-b hairline px-6 py-20 sm:py-28" aria-labelledby="shapes">
          <div className="mx-auto max-w-6xl">
            <h2 id="shapes" className="sr-only">Engagement shapes</h2>
            <div className="grid gap-px overflow-clip rounded-2xl border hairline bg-white/10 lg:grid-cols-3">
              {ENGAGEMENTS.shapes.map((s, i) => (
                <Reveal key={s.id} delay={i * 80} className="flex flex-col bg-[#121212] p-7 sm:p-8">
                  <Num n={i + 1}>{s.length}</Num>
                  <h3 className="display mt-4 text-3xl text-white">{s.name}</h3>
                  <p className="mt-3 flex items-baseline gap-2">
                    <span className="label text-neutral-500">from</span>
                    <span className="display-sm text-3xl text-white">{ENGAGEMENTS.currency} {s.from.toLocaleString("en-US")}</span>
                    <span className="label text-neutral-500">{s.unit === "month" ? "/ month" : s.unit === "fixed" ? "fixed" : "/ project"}</span>
                  </p>
                  <p className="mt-4 text-sm leading-6 text-neutral-300">{s.fit}</p>
                  <ul className="mt-5 flex flex-col gap-2 border-t hairline pt-5">
                    {s.deliverables.map((d, j) => (
                      <li key={d} className="flex gap-3 text-sm leading-6 text-neutral-400"><span className="label mt-1.5 shrink-0 text-brand-400">({pad(j + 1)})</span>{d}</li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-7"><Btn href="#book" solid={i === 0}>{i === 0 ? "Start with discovery" : "Talk about this"}</Btn></div>
                </Reveal>
              ))}
            </div>
            <p className="mt-5 text-xs leading-5 text-neutral-500">
              Builds are built from a week rate of {ENGAGEMENTS.currency} {ENGAGEMENTS.weekRate.from.toLocaleString("en-US")}. {ENGAGEMENTS.weekRate.note} If Flows or Agent Studio covers the job, I will say so on the call; both are free to start.
            </p>
          </div>
        </section>

        <section className="border-b hairline px-6 py-20 sm:py-28" aria-labelledby="how">
          <div className="mx-auto max-w-6xl">
            <Eyebrow>How an engagement runs</Eyebrow>
            <h2 id="how" className="display mt-5 text-4xl text-white sm:text-6xl">Talk, discover, build, run<span className="text-neutral-500">.</span></h2>
            <div className="mt-12 grid gap-px overflow-clip rounded-2xl border hairline bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
              {BUILD_AI_SYSTEM_PAGE.process.items.map((s, i) => (
                <div key={s.title} className="bg-[#121212] p-6">
                  <Num n={i + 1} />
                  <h3 className="display mt-4 text-3xl text-white">{s.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-neutral-400">{firstSentence(s.body, 160)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b hairline px-6 py-20 sm:py-28" aria-labelledby="trust">
          <div className="mx-auto max-w-6xl">
            <Eyebrow>Working together</Eyebrow>
            <h2 id="trust" className="display mt-5 text-4xl text-white sm:text-6xl">The boring parts, <span className="text-neutral-500">answered up front.</span></h2>
            <div className="mt-12 border-t hairline">
              {WORKING_TOGETHER.map((w, i) => (
                <div key={w.title} className="grid gap-2 border-b hairline py-6 sm:grid-cols-[5rem_14rem_1fr] sm:gap-8">
                  <span className="label text-brand-400">{pad(i + 1)}</span>
                  <h3 className="display-sm text-xl text-white">{w.title}</h3>
                  <p className="text-sm leading-6 text-neutral-300">{w.body}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-xs leading-5 text-neutral-500">
              The same operator runs <Link href="/flows" className="text-neutral-300 underline underline-offset-4">Flows</Link> and <Link href="/agent-studio" className="text-neutral-300 underline underline-offset-4">Agent Studio</Link>; their published <a href="https://agents.nishyai.com/terms" className="text-neutral-300 underline underline-offset-4">terms</a> and <a href="https://agents.nishyai.com/privacy" className="text-neutral-300 underline underline-offset-4">privacy policies</a> show how I handle billing and data at product scale. This site&apos;s own policy is at <Link href="/privacy" className="text-neutral-300 underline underline-offset-4">/privacy</Link>.
            </p>
          </div>
        </section>

        <section id="book" className="border-b hairline px-6 py-20 sm:py-28">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <Eyebrow>Next step</Eyebrow>
              <h2 className="display mt-5 text-4xl text-white sm:text-6xl">Twenty minutes, <span className="text-neutral-500">no pitch.</span></h2>
              <p className="mt-5 max-w-md text-base leading-7 text-neutral-400">Tell me the process and the tools. I will say which shape fits, or that a product already covers it, and send a slot within a business day.</p>
            </div>
            <BookingForm />
          </div>
        </section>

        <FAQ items={ENGAGEMENT_FAQS} eyebrow="Engagement questions" title="Before you book." id="engagement-faq" />
      </main>
      <Contact siteSettings={siteSettings} />
    </div>
  );
}
