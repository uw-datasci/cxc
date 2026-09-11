"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/** Seconds to wait between resends, so a stuck user cannot hammer the mailer. */
const RESEND_COOLDOWN_SECONDS = 60;

export function VerifyEmailForm({
  email,
  redirectTo = "/",
}: Readonly<{ email: string; redirectTo?: string }>) {
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
    setPending(true);
    setError(null);
    setNotice(null);

    const otp = String(new FormData(event.currentTarget).get("otp")).trim();
    const { data, error: verifyError } = await authClient.emailOtp.verifyEmail({ email, otp });

    if (verifyError) {
      // The server counts attempts against the stored code and burns it after
      // too many, so point at the resend rather than inviting endless guessing.
      setError(
        verifyError.code === "INVALID_OTP"
          ? "That code isn't right. Check the latest email, or send a new code."
          : (verifyError.message ?? "Could not verify that code.")
      );
      setPending(false);
      return;
    }

    /**
     * The guard reads `emailVerified` from the signed session-data cookie, and
     * trusts it for `sessionDataTtl` (60s) without asking the auth server. So
     * what matters here is not that the address is verified upstream — it is —
     * but that this browser stops holding a cookie which says otherwise.
     *
     * With `autoSignInAfterVerification` enabled, verifyEmail returns a token
     * and the proxy issues a fresh session cookie on that response, so the
     * guard sees the new value on the very next request. Note that a
     * `getSession({ disableCookieCache: true })` call does NOT achieve this:
     * it returns fresh data but sets no cookie, leaving the stale one in place.
     */
    if (data?.token) {
      router.push(redirectTo);
      router.refresh();
      return;
    }

    /**
     * No token means no refreshed cookie — this browser would keep being sent
     * back here until the cached value aged out. Signing out and back in is
     * deterministic and, since the address is now verified, immediate. This is
     * a safety net: it should not trigger while autoSignInAfterVerification is
     * on, but it beats a redirect loop if that setting ever changes.
     */
    await authClient.signOut();
    router.push("/sign-in");
    router.refresh();
  }

  async function onResend() {
    setResending(true);
    setError(null);
    setNotice(null);

    const { error: resendError } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "email-verification",
    });

    if (resendError) {
      setError(resendError.message ?? "Could not send a new code.");
    } else {
      setNotice("Sent. Check your inbox — and your spam folder.");
      setCooldown(RESEND_COOLDOWN_SECONDS);
    }

    setResending(false);
  }

  async function onUseAnotherEmail() {
    await authClient.signOut();
    router.push("/sign-up");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="otp">Verification code</Label>
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
          {pending ? "Verifying…" : "Verify email"}
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

        <button
          type="button"
          onClick={onUseAnotherEmail}
          disabled={pending}
          className="text-muted-foreground hover:text-foreground underline underline-offset-4"
        >
          Use a different email
        </button>
      </div>
    </div>
  );
}
