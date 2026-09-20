"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/** Seconds to wait between resends, so a stuck user cannot hammer the mailer. */
const RESEND_COOLDOWN_SECONDS = 60;

/** Matches the minimum enforced at sign-up (see SignUpForm). */
const MIN_PASSWORD_LENGTH = 8;

/** Maps a reset failure onto something the user can act on. */
function describeResetError(error: { code?: string; message?: string }): string {
  switch (error.code) {
    case "INVALID_OTP":
      return "That code isn't right. Check the latest email, or send a new code.";
    case "TOO_MANY_ATTEMPTS":
      return "Too many incorrect attempts. Send a new code to try again.";
    default:
      return error.message ?? "Could not reset your password.";
  }
}

/**
 * Step two of password recovery: the code and the new password together.
 *
 * One submit rather than two screens, because `resetPassword` takes both in a
 * single call — splitting them would leave a validated code expiring in state.
 */
export function ResetPasswordForm({ email }: Readonly<{ email: string }>) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const otp = String(form.get("otp")).trim();
    const password = String(form.get("password"));
    const confirmPassword = String(form.get("confirmPassword"));

    // The server checks the code before the password, and a code survives only
    // three attempts — so don't spend one on a password we can reject here.
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Use a password of at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }

    if (password !== confirmPassword) {
      setError("Those passwords don't match.");
      return;
    }

    setPending(true);
    setError(null);
    setNotice(null);

    const { error: resetError } = await authClient.emailOtp.resetPassword({
      email,
      otp,
      password,
    });

    if (resetError) {
      setError(describeResetError(resetError));
      setPending(false);
      return;
    }

    // Resetting leaves no session behind, so sign in with what they just chose
    // rather than making them type it again on /sign-in.
    const { data } = await authClient.signIn.email({ email, password });

    // The password change landed even if signing in did not (a banned account,
    // say), so don't show an error implying the reset failed.
    if (!data) {
      router.push("/sign-in");
      router.refresh();
      return;
    }

    // Better Auth does not revoke other sessions on reset unless the auth server
    // says to, and whoever knew the old password may still be holding one.
    await authClient.revokeOtherSessions();

    // A reset does not necessarily flip `emailVerified`, and requireUser() would
    // bounce them to /verify-email anyway. Same branch as SignInForm.
    if (!data.user.emailVerified) {
      await authClient.emailOtp.sendVerificationOtp({ email, type: "email-verification" });
      router.push("/verify-email");
      router.refresh();
      return;
    }

    router.push("/");
    router.refresh();
  }

  async function onResend() {
    setResending(true);
    setError(null);
    setNotice(null);

    const { error: resendError } = await authClient.emailOtp.requestPasswordReset({ email });

    if (resendError) {
      setError("Could not send a new code. Try again in a moment.");
    } else {
      setNotice("Sent. Check your inbox — and your spam folder.");
      setCooldown(RESEND_COOLDOWN_SECONDS);
    }

    setResending(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="otp">Reset code</Label>
          <Input
            id="otp"
            name="otp"
            /* one-time-code lets iOS and Android offer the emailed code inline. */
            autoComplete="one-time-code"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            required
            autoFocus
            disabled={pending}
            placeholder="123456"
            className="text-center text-lg tracking-[0.4em]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password">New password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={MIN_PASSWORD_LENGTH}
            disabled={pending}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="confirmPassword">Confirm new password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            minLength={MIN_PASSWORD_LENGTH}
            disabled={pending}
          />
        </div>

        {error ? (
          <p role="alert" className="text-destructive text-sm">
            {error}
          </p>
        ) : null}

        {notice ? (
          <p role="status" className="text-muted-foreground text-sm">
            {notice}
          </p>
        ) : null}

        <Button type="submit" disabled={pending}>
          {pending ? "Resetting…" : "Reset password"}
        </Button>
      </form>

      <div className="flex flex-col gap-2 text-center text-sm">
        <Button
          type="button"
          variant="ghost"
          onClick={onResend}
          disabled={resending || cooldown > 0 || pending}
        >
          {cooldown > 0
            ? `Resend code in ${cooldown}s`
            : resending
              ? "Sending…"
              : "Send a new code"}
        </Button>

        <Link
          href="/forgot-password"
          className="text-muted-foreground hover:text-foreground underline underline-offset-4"
        >
          Use a different email
        </Link>
      </div>
    </div>
  );
}
