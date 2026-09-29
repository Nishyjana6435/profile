import type { NextConfig } from "next";

const LEGACY_HOST = [{ type: "host" as const, value: "www.nishy.space" }];
const NEW_ORIGIN = "https://www.nishyai.com";

const nextConfig: NextConfig = {
  // nishy.space moved to nishyai.com: permanent, path-preserving redirects for SEO.
  // /api/* is left alone so existing webhooks (Contentful revalidate) keep working.
  async redirects() {
    return [
      { source: "/", has: LEGACY_HOST, destination: `${NEW_ORIGIN}/`, permanent: true },
      { source: "/:path((?!api/).+)", has: LEGACY_HOST, destination: `${NEW_ORIGIN}/:path`, permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.ctfassets.net",
      },
    ],
  },
};

export default nextConfig;
