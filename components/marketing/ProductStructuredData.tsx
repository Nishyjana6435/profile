import type { ProductPageConfig } from "@/lib/marketing/types";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export default function ProductStructuredData({ config }: { config: ProductPageConfig }) {
  const pageUrl = `${SITE_URL}/${config.slug}`;
  const softwareId = `${config.url}#software`;

  const software = {
    "@type": "SoftwareApplication",
    "@id": softwareId,
    name: config.name,
    url: config.url,
    description: config.seo.description,
    applicationCategory: config.applicationCategory,
    operatingSystem: "Web",
    slogan: config.tagline,
    author: { "@id": `${SITE_URL}/#person` },
    creator: { "@id": `${SITE_URL}/#person` },
    keywords: config.seo.keywords.join(", "),
    featureList: config.features.items.map((f) => f.title).join(", "),
    offers: config.pricing.plans.map((plan) => ({
      "@type": "Offer",
      name: plan.name,
      price: plan.price.replace(/[^0-9.]/g, ""),
      priceCurrency: "USD",
      description: `${plan.blurb} ${plan.features.join(", ")}.`,
      url: config.url,
    })),
  };

  const webPage = {
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: config.seo.title,
    description: config.seo.description,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": softwareId },
    author: { "@id": `${SITE_URL}/#person` },
    inLanguage: "en",
  };

  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: config.name, item: pageUrl },
    ],
  };

  const howTo = {
    "@type": "HowTo",
    "@id": `${pageUrl}#howto`,
    name: config.steps.heading,
    description: config.steps.intro,
    step: config.steps.items.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      text: s.body,
    })),
  };

  const faqPage = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: config.faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  const person = {
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: SITE_NAME,
    url: SITE_URL,
  };

  const website = {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [webPage, breadcrumb, software, howTo, faqPage, person, website],
        }),
      }}
    />
  );
}
