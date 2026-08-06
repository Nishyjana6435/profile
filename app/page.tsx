import type { Metadata } from "next";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import WorkExperience from "@/components/WorkExperience";
import SkillsOrbit from "@/components/SkillsOrbit";
import FeaturedProjects from "@/components/FeaturedProjects";
import ProjectCarousel from "@/components/ProjectCarousel";
import FAQ from "@/components/FAQ";
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

  const titleParts = [fields?.name ?? SITE_NAME, fields?.title].filter(Boolean);
  const title = titleParts.join(" — ");
  const description =
    richTextToPlainText(fields?.bio) ||
    siteSettings?.fields.siteDescription ||
    "Full stack developer and self-taught UI/UX designer leading cross-functional teams to ship accessible, high-impact products.";
  const avatar = fields?.avatar && "fields" in fields.avatar ? fields.avatar : undefined;
  const avatarUrl = avatar?.fields.file?.url ? `https:${avatar.fields.file.url}` : undefined;

  const keywords = Array.from(new Set([...(fields?.skills ?? []), ...EXTRA_KEYWORDS]));

  return {
    title: { absolute: title },
    description,
    keywords,
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
  const [profile, experienceItems, featuredProjects, projectCarousels, siteSettings] =
    await Promise.all([
      getProfile(),
      getExperienceItems(),
      getFeaturedProjects(),
      getProjectCarousels(),
      getSiteSettings(),
    ]);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#0a0514] text-white">
      <StructuredData
        profile={profile}
        siteSettings={siteSettings}
        projects={featuredProjects}
        faqItems={faqItems}
      />
      <Header />
      <main className="flex-1">
        <Hero profile={profile} />
        {projectCarousels.map((carousel) => (
          <ProjectCarousel key={carousel.sys.id} carousel={carousel} />
        ))}
        <WorkExperience items={experienceItems} />

        <SkillsOrbit
          lookingForText={profile?.fields.lookingForText}
          lookingForHighlight={profile?.fields.lookingForHighlight}
          skills={profile?.fields.skills ?? []}
        />
        <FeaturedProjects projects={featuredProjects} />
        
        <FAQ items={faqItems} />
      </main>
      <Contact siteSettings={siteSettings} />
    </div>
  );
}
