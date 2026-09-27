import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/** AI crawlers are explicitly welcome; the site is built to be read by agents. */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Googlebot",
  "Bingbot",
  "Applebot",
  "Applebot-Extended",
  "DuckAssistBot",
  "Amazonbot",
  "Meta-ExternalAgent",
  "Meta-ExternalFetcher",
  "CCBot",
  "cohere-ai",
  "YouBot",
  "MistralAI-User",
  "Bytespider",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: AI_CRAWLERS, allow: "/" },
      { userAgent: "*", allow: "/", disallow: "/api/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
