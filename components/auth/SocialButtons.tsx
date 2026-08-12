"use client";

import { useState } from "react";

import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";

interface SocialButtonsProps {
  /** Where to land after the provider redirects back. */
  callbackURL?: string;
  disabled?: boolean;
}

const PROVIDERS = [
  { id: "google", label: "Continue with Google" },
  { id: "github", label: "Continue with GitHub" },
] as const;

export function SocialButtons({ callbackURL = "/", disabled }: Readonly<SocialButtonsProps>) {
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function signInWith(provider: (typeof PROVIDERS)[number]["id"]) {
    setPending(provider);
    setError(null);

    const { error: signInError } = await authClient.signIn.social({ provider, callbackURL });

    // On success the browser is redirected, so this only runs on failure.
    if (signInError) {
      setError(signInError.message ?? "Could not sign in with that provider.");
      setPending(null);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {PROVIDERS.map((provider) => (
        <Button
          key={provider.id}
          type="button"
          variant="outline"
          disabled={disabled || pending !== null}
          onClick={() => signInWith(provider.id)}
        >
          {pending === provider.id ? "Redirecting…" : provider.label}
        </Button>
      ))}

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
