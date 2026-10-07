import type { Metadata, Viewport } from "next";
import { Caveat, Geist_Mono, Inter, Space_Grotesk } from "next/font/google";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import { accentCss } from "@/lib/theme";
import "./globals.css";
import AssistantWidget from "@/components/AssistantWidget";
import Cursor from "@/components/Cursor";
import SmoothScroll from "@/components/SmoothScroll";
import LiveText from "@/components/LiveText";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["600"],
  preload: false, // only the footer signature uses it
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} (Nishy) — Founder of Agent Studio & Flows`,
    template: `%s — ${SITE_NAME}`,
  },
  description:
    "Nishanthan Janarthanarajah (Nishy) builds AI agents, workflows and RAG assistants that run real business processes. Founder of Agent Studio and Flows.",
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
  alternates: {
    canonical: "/",
    types: {
      "text/markdown": "/llms.txt",
      "application/json": "/agent.json",
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#121212",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistMono.variable} ${inter.variable} ${spaceGrotesk.variable} ${caveat.variable} h-full scroll-smooth antialiased motion-reduce:scroll-auto`}
    >
      <head>
        {/* accent colour tokens: edit lib/theme.ts */}
        <style dangerouslySetInnerHTML={{ __html: accentCss() }} />
      </head>
      <body className="min-h-full flex flex-col bg-[#121212]">
        {children}
        <AssistantWidget />
        <Cursor />
        <SmoothScroll />
        <LiveText />
      </body>
    </html>
  );
}
