import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import type { ProductPageConfig } from "./types";

export function productMetadata(config: ProductPageConfig): Metadata {
  const url = `${SITE_URL}/${config.slug}`;
  return {
    title: { absolute: config.seo.title },
    description: config.seo.description,
    keywords: config.seo.keywords,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title: config.seo.title,
      description: config.seo.description,
      url,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title: config.seo.title,
      description: config.seo.description,
    },
  };
}
