import { AGENT_STUDIO_PAGE } from "@/lib/marketing/agent-studio-page";
import { OG_IMAGE_SIZE, renderProductOgImage } from "@/lib/og-image";

export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";
export const alt = `${AGENT_STUDIO_PAGE.name}: ${AGENT_STUDIO_PAGE.tagline}`;

export default function Image() {
  return renderProductOgImage({
    name: AGENT_STUDIO_PAGE.name,
    tagline: AGENT_STUDIO_PAGE.tagline,
    description: "Visual AI agent builder with guardrails and a prompt-injection shield, deployed as an API.",
    accent: "sky",
  });
}
