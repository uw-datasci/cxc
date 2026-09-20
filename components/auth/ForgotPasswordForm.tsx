"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Step one of password recovery: ask for the address, request a code.
 *
 * A code rather than a link: Neon requires a custom email provider for links,
 * and this project is still on the shared mailer.
 */
export function ForgotPasswordForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const email = String(new FormData(event.currentTarget).get("email")).trim().toLowerCase();
    const { error: requestError } = await authClient.emailOtp.requestPasswordReset({ email });

    // The endpoint answers `{ success: true }` for an unknown address, so only a
    // send failure stops us — branching on the account existing would leak it.
    if (requestError) {
      setError("Could not send a code right now. Try again in a moment.");
      setPending(false);
      return;
    }

    // In the query string because the next screen has no session to read it from,
    // and unlike component state it survives a refresh.
    router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            autoFocus
            disabled={pending}
          />
        </div>

        {error ? (
          <p role="alert" className="text-destructive text-sm">
            {error}
          </p>
        ) : null}

        <Button type="submit" disabled={pending}>
          {pending ? "Sending code…" : "Send code"}
        </Button>
      </form>

      <p className="text-muted-foreground text-center text-sm">
        Remembered it?{" "}
        <Link href="/sign-in" className="text-foreground underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </div>
  );
}
