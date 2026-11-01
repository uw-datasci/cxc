import { ComingSoon } from "@/components/home/ComingSoon";
import { Footer } from "components/home/Footer";
import { FaqSection } from "components/home/faq/FaqSection";

export default function Page() {
  return (
    <div>
      <ComingSoon />
      <FaqSection />
      <Footer />
    </div>
  );
}
