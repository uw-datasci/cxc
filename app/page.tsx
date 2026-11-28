// import { connection } from "next/server";
// import { CountdownPanel } from "@/components/home/coming-soon/CountdownPanel";
// import { Hero } from "@/components/home/hero/Hero";
// import { siteConfig } from "@/config/site";

import { AboutSection } from "@/components/home/about/AboutSection";
import { ComingSoon } from "@/components/home/coming-soon/ComingSoon";
import { DossierPanel } from "@/components/home/coming-soon/DossierPanel";
import { FaqSection } from "@/components/home/faq/FaqSection";
import { Footer } from "@/components/home/footer/Footer";
import { ProjectsSection } from "@/components/home/projects/ProjectsSection";
import { SponsorsSection } from "@/components/home/sponsors/SponsorsSection";
import { Team } from "@/components/home/team/Team";
import { Nav } from "@/components/nav";

// const hasLaunched = (): boolean => Date.now() >= new Date(siteConfig.launchAt).getTime();

export default function Page() {
  // await connection(); // Render per request, so the check uses the current time rather than the build time.

  // const heroSection = hasLaunched() ? <Hero /> : <ComingSoon><CountdownPanel /></ComingSoon>;

  return (
    <div>
      <Nav />
      {/* {heroSection} */}
      {/* ----- TODO: remove once countdown set ----- */}
      <ComingSoon>
        <DossierPanel />
      </ComingSoon>
      {/* ----------- */}
      <AboutSection />
      <ProjectsSection />
      <SponsorsSection />
      <FaqSection />
      <Team />
      <Footer />
    </div>
  );
}
