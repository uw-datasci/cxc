/**
 * Site-wide switches.
 *
 * These are plain constants, not environment variables: flipping one is a reviewed code
 * change that ships with a deploy, not something that can drift per environment.
 * Safe to import from anywhere — proxy, server, or client code.
 */
export const siteConfig = {
  /**
   * Pre-launch lockdown. While `true`, only the coming-soon page (`/`) and explicitly
   * allowlisted pre-launch API routes are reachable. Every other page redirects to `/`,
   * and every other API route returns 404.
   *
   * Enforced in `proxy.ts`, and again in `withAuth`, `requireUser`, the `(auth)` layout,
   * and the Neon Auth handler, so a single missed check can't expose anything.
   */
  comingSoon: true,

  /**
   * When the home page countdown ends and the hero replaces it. An ISO string with an
   * explicit UTC offset. Independent of `comingSoon`, which must still be turned off by hand.
   *
   * TODO: placeholder until the application release date is confirmed.
   */
  launchAt: "2026-12-06T09:00:00-05:00",
} as const;

/** The only page that is served while {@link siteConfig.comingSoon} is on. */
export const COMING_SOON_PATH = "/";
