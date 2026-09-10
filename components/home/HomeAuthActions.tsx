"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/useAuth";

export function HomeAuthActions() {
  const router = useRouter();
  const { user, isAuthenticated, isPending, signOut } = useAuth();

  async function handleSignOut() {
    await signOut();
    router.refresh();
  }

  if (isPending) {
    return (
      <p className="text-sm text-muted-foreground" aria-live="polite">
        Checking session…
      </p>
    );
  }

  if (isAuthenticated && user) {
    const displayName = user.name?.trim() || user.email;

    return (
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <p className="text-sm">
          Signed in as <span className="font-medium">{displayName}</span>
        </p>
        <Button variant="outline" size="sm" onClick={handleSignOut}>
          Sign out
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" asChild>
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild>
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
