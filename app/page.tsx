import type { Metadata } from "next";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import LogoStrip from "@/components/LogoStrip";
import WhatIDo from "@/components/WhatIDo";
import FlowsShowcase from "@/components/FlowsShowcase";
import AgentShowcase from "@/components/AgentShowcase";
import ToolsPool from "@/components/ToolsPool";
import Process from "@/components/Process";
import WorkExperience from "@/components/WorkExperience";
import ProjectCarousel from "@/components/ProjectCarousel";
import FeaturedProjects from "@/components/FeaturedProjects";
import CtaBand from "@/components/CtaBand";
import Contact from "@/components/Contact";
import StructuredData from "@/components/StructuredData";
import {
  getProfile,
  getExperienceItems,
  getFeaturedProjects,
  getProjectCarousels,
  getSiteSettings,
} from "@/lib/contentful";
import { faqItems } from "@/lib/faq";
import { richTextToPlainText } from "@/lib/richtext";
import { EXTRA_KEYWORDS, SITE_NAME, SITE_URL } from "@/lib/seo";

export const revalidate = 60000;

export async function generateMetadata(): Promise<Metadata> {
  const [profile, siteSettings] = await Promise.all([
    getProfile(),
    getSiteSettings(),
  ]);
  const fields = profile?.fields;

  const title = `${fields?.name ?? SITE_NAME} (Nishy) — Founder of Agent Studio & Flows | AI Engineer`;
  const description =
    `Nishanthan Janarthanarajah (Nishy) is the founder of Agent Studio and Flows, and an independent AI engineer in Colombo, Sri Lanka, available for client projects worldwide. ${richTextToPlainText(fields?.bio)}`.trim() ||
    siteSettings?.fields.siteDescription ||
    "AI engineer building agents, workflows and RAG assistants that run real business processes.";
  const avatar = fields?.avatar && "fields" in fields.avatar ? fields.avatar : undefined;
  const avatarUrl = avatar?.fields.file?.url ? `https:${avatar.fields.file.url}` : undefined;

  const keywords = Array.from(new Set([...(fields?.skills ?? []), ...EXTRA_KEYWORDS]));

  return {
    title: { absolute: title },
    description,
    keywords,
    authors: fields?.name ? [{ name: fields.name, url: SITE_URL }] : undefined,
    alternates: {
      canonical: SITE_URL,
      types: { "text/markdown": `${SITE_URL}/md/home`, "application/json": `${SITE_URL}/agent.json` },
    },
    openGraph: {
      type: "profile",
      title,
      description,
      url: SITE_URL,
      siteName: siteSettings?.fields.siteTitle ?? SITE_NAME,
      images: avatarUrl ? [avatarUrl] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: avatarUrl ? [avatarUrl] : undefined,
    },
  };
}

export default async function Home() {
  const [profile, experienceItems, featuredProjects, projectCarousels, siteSettings] = await Promise.all([
    getProfile(),
    getExperienceItems(),
    getFeaturedProjects(),
    getProjectCarousels(),
    getSiteSettings(),
  ]);

  // The story: who (hero) -> what I do -> how I do it -> how long -> proof -> next step.
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#121212] text-white">
      <StructuredData profile={profile} siteSettings={siteSettings} projects={featuredProjects} faqItems={faqItems} />
      <Header />
      <main className="flex-1">
        <Hero profile={profile} />
        <LogoStrip items={experienceItems} />
        <WhatIDo />
        <FlowsShowcase />
        <AgentShowcase />
        <ToolsPool />
        <Process />
        <WorkExperience items={experienceItems} />
        {projectCarousels.map((carousel) => (
          <ProjectCarousel key={carousel.sys.id} carousel={carousel} />
        ))}
        <FeaturedProjects projects={featuredProjects} />
        <CtaBand lookingFor={profile?.fields.lookingForText} />
      </main>
      <Contact siteSettings={siteSettings} />
    </div>
  );
}
