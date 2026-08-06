import type { Metadata } from "next";
import Header from "@/components/Header";
import Contact from "@/components/Contact";
import FeaturedProjects from "@/components/FeaturedProjects";
import FAQ from "@/components/FAQ";
import {
  getFeaturedProjects,
  getHirePage,
  getSiteSettings,
  type FaqItemEntry,
  type ServiceEntry,
} from "@/lib/contentful";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const revalidate = 60000;

function withHighlight(text: string, highlight?: string) {
  if (!highlight) return text;
  const index = text.toLowerCase().indexOf(highlight.toLowerCase());
  if (index === -1) return text;
  return (
    <>
      {text.slice(0, index)}
      <span className="text-violet-400">
        {text.slice(index, index + highlight.length)}
      </span>
      {text.slice(index + highlight.length)}
    </>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const hirePage = await getHirePage();
  const fields = hirePage?.fields;

  const title = fields?.seoTitle || `Hire Me — ${SITE_NAME}`;
  const description = fields?.seoDescription || fields?.intro || "";
  const url = `${SITE_URL}/hire`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "profile",
      title,
      description,
      url,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function HirePage() {
  const [hirePage, featuredProjects, siteSettings] = await Promise.all([
    getHirePage(),
    getFeaturedProjects(),
    getSiteSettings(),
  ]);

  const fields = hirePage?.fields;
  const services = (fields?.services ?? []).filter(
    (service): service is ServiceEntry => Boolean(service && "fields" in service)
  );
  const faqItems = (fields?.faqItems ?? [])
    .filter((item): item is FaqItemEntry => Boolean(item && "fields" in item))
    .map((item) => ({ question: item.fields.question, answer: item.fields.answer }));

  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#0a0514] text-white">
      <Header />
      <main className="flex-1">
        <section className="px-6 pt-20 pb-16">
          <div className="mx-auto max-w-4xl">
            {fields?.badge && (
              <p className="text-sm uppercase tracking-wide text-white/50">
                {fields.badge}
              </p>
            )}
            {fields?.headline && (
              <h1 className="mt-2 text-3xl font-semibold leading-tight text-white sm:text-4xl">
                {withHighlight(fields.headline, fields.headlineHighlight)}
              </h1>
            )}
            {fields?.intro && (
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60">
                {fields.intro}
              </p>
            )}

            {fields?.engagementTypes && fields.engagementTypes.length > 0 && (
              <ul className="mt-8 flex flex-wrap gap-3">
                {fields.engagementTypes.map((type) => (
                  <li
                    key={type}
                    className="rounded-full border border-white/15 px-4 py-2 text-xs text-white/70"
                  >
                    {type}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {services.length > 0 && (
          <section className="px-6 py-16">
            <div className="mx-auto max-w-6xl">
              <h2 className="text-2xl font-semibold text-white">What I Can Help With</h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {services.map((service) => (
                  <div
                    key={service.sys.id}
                    className="rounded-2xl border border-white/5 bg-gradient-to-br from-violet-900/40 to-[#1a0f38] p-6"
                  >
                    <h3 className="font-medium text-white">{service.fields.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/60">
                      {service.fields.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <FeaturedProjects projects={featuredProjects} />
        <FAQ items={faqItems} />
      </main>
      <Contact siteSettings={siteSettings} />
    </div>
  );
}
