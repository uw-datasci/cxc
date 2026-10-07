import { notFound } from "next/navigation";

import { siteConfig } from "@/config/site";

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Pre-launch lockdown backstop; proxy.ts already redirects these routes.
  if (siteConfig.comingSoon) notFound();

  return (
    <main className="flex min-h-dvh items-center justify-center p-6">
      <div className="w-full max-w-sm">{children}</div>
    </main>
  );
}
