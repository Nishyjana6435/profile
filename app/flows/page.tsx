import type { Metadata } from "next";
import ProductLanding from "@/components/marketing/ProductLanding";
import { getSiteSettings } from "@/lib/contentful";
import { FLOWS_PAGE } from "@/lib/marketing/flows-page";
import { productMetadata } from "@/lib/marketing/metadata";

export const revalidate = 60000;

export const metadata: Metadata = productMetadata(FLOWS_PAGE);

export default async function Page() {
  const siteSettings = await getSiteSettings();
  return <ProductLanding config={FLOWS_PAGE} siteSettings={siteSettings} />;
}
