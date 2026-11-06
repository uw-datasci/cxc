import { AboutSection } from "@/components/home/about/AboutSection";
import { ComingSoon } from "@/components/home/coming-soon/ComingSoon";
import { CountdownPanel } from "@/components/home/coming-soon/CountdownPanel";
import { FaqSection } from "@/components/home/faq/FaqSection";
import { Footer } from "@/components/home/footer/Footer";
import { Hero } from "@/components/home/hero/Hero";
import { Team } from "@/components/home/team/Team";

export default function Page() {
  return (
    <div>
      <Hero />
      <ComingSoon><CountdownPanel /></ComingSoon>
      <AboutSection />
      <FaqSection />
      <Team />
      <Footer />
    </div>
  );
}
