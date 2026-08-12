"use client";

import { createAuthClient } from "@neondatabase/auth/next";

/**
 * Client-side Neon Auth instance.
 *
 * Use from Client Components for sign-in, sign-up, sign-out, and reading the
 * current session in the browser. Never use it to gate anything that matters —
 * client state is advisory. Authorization is enforced server-side by
 * `lib/auth/guard.ts`.
 */
export const authClient = createAuthClient();
