import { FLOWS_PAGE } from "@/lib/marketing/flows-page";
import { OG_IMAGE_SIZE, renderProductOgImage } from "@/lib/og-image";

export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";
export const alt = `${FLOWS_PAGE.name}: ${FLOWS_PAGE.tagline}`;

export default function Image() {
  return renderProductOgImage({
    name: FLOWS_PAGE.name,
    tagline: FLOWS_PAGE.tagline,
    description: "AI workflow automation in plain English. Slack, Google Sheets, Gmail, SMS and any REST API.",
    accent: "fuchsia",
  });
}
