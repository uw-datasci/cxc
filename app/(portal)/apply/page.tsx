import type { Metadata } from "next";

import { ApplicationsOpenScreen } from "@/components/portal/ApplicationsOpenScreen";

export const metadata: Metadata = { title: "Apply" };

export default function ApplyPage() {
  return <ApplicationsOpenScreen />;
}
