import type { Metadata } from "next";
import AiEngineerLanding from "@/components/marketing/AiEngineerLanding";
import { getSiteSettings } from "@/lib/contentful";
import { AI_ENGINEER_PAGE as P } from "@/lib/marketing/ai-engineer-page";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const revalidate = 60000;

const url = `${SITE_URL}/${P.slug}`;

export const metadata: Metadata = {
  title: { absolute: P.seo.title },
  description: P.seo.description,
  keywords: P.seo.keywords,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  alternates: { canonical: url },
  openGraph: {
    type: "website",
    title: P.seo.title,
    description: P.seo.description,
    url,
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: P.seo.title,
    description: P.seo.description,
  },
};

export default async function Page() {
  const siteSettings = await getSiteSettings();
  return <AiEngineerLanding config={P} siteSettings={siteSettings} />;
}
