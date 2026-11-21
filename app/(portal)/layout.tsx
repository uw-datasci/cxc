import { notFound } from "next/navigation";

import { siteConfig } from "@/config/site";

export default function PortalLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Pre-launch lockdown backstop; proxy.ts already redirects these routes.
  if (siteConfig.comingSoon) notFound();

  return children;
}
