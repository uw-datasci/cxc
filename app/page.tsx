import { AboutSection } from "@/components/home/about/AboutSection";
import { ComingSoon } from "@/components/home/ComingSoon";
import { CountdownPanel } from "@/components/home/CountdownPanel";
import { Footer } from "components/home/Footer";
import { Hero } from "components/home/Hero";
import { Team } from "components/home/Team";
import { FaqSection } from "components/home/faq/FaqSection";

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
