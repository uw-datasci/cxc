import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { VerifyEmailForm } from "@/components/auth/VerifyEmailForm";
import { getAuthContext } from "@/lib/auth/guard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Verify your email" };

export default async function VerifyEmailPage() {
  /**
   * `getAuthContext()` rather than `requireUser()`, deliberately: requireUser
   * redirects unverified callers *to this page*, so calling it here would loop.
   * This is the one page that has to inspect the session by hand.
   */
  const ctx = await getAuthContext();
  if (!ctx) redirect("/sign-in");
  if (ctx.emailVerified) redirect("/");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Check your email</CardTitle>
        <CardDescription>
          We sent a 6-digit code to <span className="text-foreground">{ctx.email}</span>. It expires
          in 5 minutes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <VerifyEmailForm email={ctx.email} />
      </CardContent>
    </Card>
  );
}
