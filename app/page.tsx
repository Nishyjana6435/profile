import Header from "@/components/Header";
import Hero from "@/components/Hero";
import WorkExperience from "@/components/WorkExperience";
import SkillsOrbit from "@/components/SkillsOrbit";
import FeaturedProjects from "@/components/FeaturedProjects";
import Contact from "@/components/Contact";
import {
  getProfile,
  getExperienceItems,
  getFeaturedProjects,
  getSiteSettings,
} from "@/lib/contentful";

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
