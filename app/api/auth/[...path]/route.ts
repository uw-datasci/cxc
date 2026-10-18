import { RaftResponse } from "@uw-datasci/raft";

import { siteConfig } from "@/config/site";
import { auth } from "@/lib/auth/server";

const handler = auth.handler();

type AuthRoute = typeof handler.GET;

/** 404s while the pre-launch lockdown is on; proxy.ts already blocks /api, this is the backstop. */
function unlessComingSoon(route: AuthRoute): AuthRoute {
  return async (request, context) =>
    siteConfig.comingSoon ? RaftResponse.notFound() : route(request, context);
}

/**
 * Catch-all handler for every Neon Auth flow: sign-in, sign-up, sign-out,
 * OAuth callbacks, and session management.
 */
export const GET = unlessComingSoon(handler.GET);
export const POST = unlessComingSoon(handler.POST);
