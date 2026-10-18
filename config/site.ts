/**
 * Site-wide switches.
 *
 * These are plain constants, not environment variables: flipping one is a reviewed code
 * change that ships with a deploy, not something that can drift per environment.
 * Safe to import from anywhere — proxy, server, or client code.
 */
export const siteConfig = {
  /**
   * Pre-launch lockdown. While `true`, only the coming-soon page (`/`) is reachable:
   * every other page redirects to `/`, and every API route returns 404.
   *
   * Enforced in `proxy.ts`, and again in `withAuth`, `requireUser`, the `(auth)` layout,
   * and the Neon Auth handler, so a single missed check can't expose anything.
   */
  comingSoon: true,
} as const;

/** The only page that is served while {@link siteConfig.comingSoon} is on. */
export const COMING_SOON_PATH = "/";
