"use client";

import { authClient } from "@/lib/auth/client";

/**
 * Client-side view of the current session.
 *
 * For rendering only — showing a name, toggling a nav item, deciding what to
 * render while loading. It carries identity but NOT the application role,
 * which is resolved server-side from `user_role`.
 *
 * Never gate anything that matters on this. Client state is advisory and
 * trivially manipulated; authorization belongs in `lib/auth/guard.ts`.
 */
export function useAuth() {
  const { data, isPending, error, refetch } = authClient.useSession();

  return {
    user: data?.user ?? null,
    isAuthenticated: Boolean(data?.user),
    isPending,
    error,
    refetch,
    signOut: authClient.signOut,
  };
}
