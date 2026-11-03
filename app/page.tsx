import { ComingSoon } from "@/components/home/ComingSoon";
import { CountdownPanel } from "@/components/home/CountdownPanel";
import { DossierPanel } from "@/components/home/DossierPanel";
import { Footer } from "components/home/Footer";
import { Team } from "components/home/Team";
import { FaqSection } from "components/home/faq/FaqSection";

// TODO: drop the gate and render the countdown everywhere once the application
// release date is confirmed.
const showCountdown = process.env.NODE_ENV === "development";

export default function Page() {
  return (
    <div>
      <ComingSoon>{showCountdown ? <CountdownPanel /> : <DossierPanel />}</ComingSoon>
      <FaqSection />
      <Team />
      <Footer />
    </div>
  );
}
