import Header from "@/components/Header";
import Hero from "@/components/Hero";
import WorkExperience from "@/components/WorkExperience";
import SkillsOrbit from "@/components/SkillsOrbit";
import FeaturedProjects from "@/components/FeaturedProjects";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#0a0514] text-white">
      <Header />
      <main className="flex-1">
        <Hero />
        <WorkExperience />
        <SkillsOrbit />
        <FeaturedProjects />
      </main>
      <Contact />
    </div>
  );
}
