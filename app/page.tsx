import type { Metadata } from "next";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import WorkExperience from "@/components/WorkExperience";
import SkillsOrbit from "@/components/SkillsOrbit";
import FeaturedProjects from "@/components/FeaturedProjects";
import Contact from "@/components/Contact";
import StructuredData from "@/components/StructuredData";
import {
  getProfile,
  getExperienceItems,
  getFeaturedProjects,
  getSiteSettings,
} from "@/lib/contentful";
import { richTextToPlainText } from "@/lib/richtext";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const revalidate = 60000;

export async function generateMetadata(): Promise<Metadata> {
  const [profile, siteSettings] = await Promise.all([
    getProfile(),
    getSiteSettings(),
  ]);
  const fields = profile?.fields;

  const titleParts = [fields?.name ?? SITE_NAME, fields?.title].filter(Boolean);
  const title = titleParts.join(" — ");
  const description =
    richTextToPlainText(fields?.bio) ||
    siteSettings?.fields.siteDescription ||
    "Full stack developer and self-taught UI/UX designer leading cross-functional teams to ship accessible, high-impact products.";
  const avatar = fields?.avatar && "fields" in fields.avatar ? fields.avatar : undefined;
  const avatarUrl = avatar?.fields.file?.url ? `https:${avatar.fields.file.url}` : undefined;

  return {
    title: { absolute: title },
    description,
    keywords: fields?.skills,
    authors: fields?.name ? [{ name: fields.name, url: SITE_URL }] : undefined,
    alternates: { canonical: SITE_URL },
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
  const [profile, experienceItems, featuredProjects, siteSettings] =
    await Promise.all([
      getProfile(),
      getExperienceItems(),
      getFeaturedProjects(),
      getSiteSettings(),
    ]);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#0a0514] text-white">
      <StructuredData
        profile={profile}
        siteSettings={siteSettings}
        projects={featuredProjects}
      />
      <Header />
      <main className="flex-1">
        <Hero profile={profile} />
        <WorkExperience items={experienceItems} />
        <SkillsOrbit
          lookingForText={profile?.fields.lookingForText}
          lookingForHighlight={profile?.fields.lookingForHighlight}
          skills={profile?.fields.skills ?? []}
        />
        <FeaturedProjects projects={featuredProjects} />
      </main>
      <Contact siteSettings={siteSettings} />
    </div>
  );
}
