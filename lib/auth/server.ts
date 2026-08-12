import "server-only";

import { createNeonAuth } from "@neondatabase/auth/next/server";

import { serverConfig } from "@/config/server";

/**
 * Server-side Neon Auth instance.
 *
 * Use from Server Components, Server Actions, Route Handlers, and `server/`
 * domain code. Session reads are backed by a signed, HTTP-only cookie cache
 * (see `sessionDataTtl`), so `getSession()` usually costs no network call.
 *
 * This handles identity only. Authorization lives in `lib/auth/guard.ts`,
 * which resolves the caller's role from our own `user_role` table — Neon's
 * Managed Better Auth cannot carry custom JWT claims, so app roles are not in
 * the token.
 */
export const auth = createNeonAuth({
  baseUrl: serverConfig.neonAuthBaseUrl,
  cookies: {
    secret: serverConfig.neonAuthCookieSecret,
    /**
     * 60s rather than the 5-minute default. A role change or a ban should take
     * effect within a minute, which matters during a live event; the cost is a
     * revalidation against the auth server at most once a minute per session.
     */
    sessionDataTtl: 60,
  },
});

/** Session shape as returned by the SDK, for typing downstream helpers. */
export type NeonSession = NonNullable<Awaited<ReturnType<typeof auth.getSession>>["data"]>;
