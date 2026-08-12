import { auth } from "@/lib/auth/server";

/**
 * Catch-all handler for every Neon Auth flow: sign-in, sign-up, sign-out,
 * OAuth callbacks, and session management.
 */
export const { GET, POST } = auth.handler();
