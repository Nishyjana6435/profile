import type { Metadata } from "next";
import ProductLanding from "@/components/marketing/ProductLanding";
import { getSiteSettings } from "@/lib/contentful";
import { AGENT_STUDIO_PAGE } from "@/lib/marketing/agent-studio-page";
import { productMetadata } from "@/lib/marketing/metadata";

export const revalidate = 60000;

export const metadata: Metadata = productMetadata(AGENT_STUDIO_PAGE);

export default async function Page() {
  const siteSettings = await getSiteSettings();
  return <ProductLanding config={AGENT_STUDIO_PAGE} siteSettings={siteSettings} />;
}
