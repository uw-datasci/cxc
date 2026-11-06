import { connection } from "next/server";

import { AboutSection } from "@/components/home/about/AboutSection";
import { ComingSoon } from "@/components/home/coming-soon/ComingSoon";
import { CountdownPanel } from "@/components/home/coming-soon/CountdownPanel";
import { FaqSection } from "@/components/home/faq/FaqSection";
import { Footer } from "@/components/home/footer/Footer";
import { Hero } from "@/components/home/hero/Hero";
import { ProjectsSection } from "@/components/home/projects/ProjectsSection";
import { SponsorsSection } from "@/components/home/sponsors/SponsorsSection";
import { Team } from "@/components/home/team/Team";
import { Nav } from "@/components/nav";
import { siteConfig } from "@/config/site";

const hasLaunched = (): boolean => Date.now() >= new Date(siteConfig.launchAt).getTime();

export default async function Page() {
  await connection(); // Render per request, so the check uses the current time rather than the build time.

  const heroSection = hasLaunched() ? <Hero /> : <ComingSoon><CountdownPanel /></ComingSoon>;

  return (
    <div>
      <Nav />
      {heroSection}
      <AboutSection />
      <ProjectsSection />
      <SponsorsSection />
      <FaqSection />
      <Team />
      <Footer />
    </div>
  );
}
