import { BUILD_AI_SYSTEM_PAGE as P } from "@/lib/marketing/ai-engineer-page";
import { OG_IMAGE_SIZE, renderProductOgImage } from "@/lib/og-image";

export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";
export const alt = P.seo.title;

export default function Image() {
  return renderProductOgImage({
    name: "Nishanthan Janarthanarajah",
    byline: P.og.byline,
    tagline: P.og.tagline,
    description: P.og.description,
    accent: "fuchsia",
  });
}
