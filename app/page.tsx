import { AboutSection } from "@/components/home/about/AboutSection";
import { ComingSoon } from "@/components/home/ComingSoon";
import { CountdownPanel } from "@/components/home/CountdownPanel";
import { Footer } from "components/home/Footer";
import { FaqSection } from "components/home/faq/FaqSection";

export default function Page() {
  return (
    <div>
      <ComingSoon><CountdownPanel /></ComingSoon>
      <AboutSection />
      <FaqSection />
      <Footer />
    </div>
  );
}
