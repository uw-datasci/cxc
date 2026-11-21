import type { Metadata } from "next";

import { WelcomeScreen } from "@/components/portal/WelcomeScreen";

export const metadata: Metadata = { title: "Welcome" };

export default function ApplyWelcomePage() {
  return <WelcomeScreen />;
}
