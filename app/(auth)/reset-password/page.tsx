import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Reset password" };

export default async function ResetPasswordPage({
  searchParams,
}: Readonly<{ searchParams: Promise<{ email?: string }> }>) {
  const { email } = await searchParams;
  const address = email?.trim().toLowerCase();

  // A code is bound to an address, so without one the form cannot work. No
  // session check, deliberately: anyone who needs this page cannot sign in.
  if (!address?.includes("@")) redirect("/forgot-password");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set a new password</CardTitle>
        <CardDescription>
          We sent a 6-digit code to <span className="text-foreground">{address}</span>. It expires
          in 5 minutes. Enter it along with your new password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResetPasswordForm email={address} />
      </CardContent>
    </Card>
  );
}
