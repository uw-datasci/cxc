import type { Metadata, Viewport } from "next";

const siteUrl = "https://cxc.uwdatascience.ca";

/**
 * Metadata shared by every route. Spread it into a route's own `metadata`
 * export, or use {@link createMetadata} for dynamic routes.
 *
 * Ported from apps/cxc in uw-datasci/uwdsc-turborepo, minus its `/meta/*`
 * references (manifest.json, ms-icon-144x144.png, og-image.png). No such
 * directory exists anywhere in that repo, so those all resolved to 404s.
 * `msapplication-TileColor` is kept because it needs no asset.
 *
 * To restore them: add the files under `public/meta/`, then re-add `manifest`
 * and `msapplication-TileImage` here, and `images` to the openGraph/twitter
 * blocks in `app/layout.tsx`.
 *
 * Icons are file-based (`app/favicon.ico`) rather than configured here.
 */
export const baseMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "msapplication-TileColor": "#000211",
  },
};

export const baseViewport: Viewport = { themeColor: "#000211" };

const DEFAULT_DESCRIPTION = "CxC - UWaterloo's premier data science competition and hackathon";

/**
 * Builds metadata for a route.
 *
 * For static routes, call it at module scope and assign to `metadata`. For
 * dynamic routes, call it inside `generateMetadata()` once you have the data.
 *
 * `image` has no default: there is no site-wide OG image asset yet, and
 * pointing at one that 404s breaks the preview rather than omitting it. Pass a
 * path to opt a route in, which also upgrades its Twitter card to
 * `summary_large_image`.
 *
 * @example
 * export const metadata = createMetadata({
 *   title: "Schedule",
 *   description: "Event schedule for CxC.",
 *   pathname: "/schedule",
 * });
 */
export function createMetadata({
  title,
  description,
  keywords,
  image,
  pathname,
}: {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
  pathname?: string;
}): Metadata {
  const fullTitle = `${title} | CxC - UWaterloo Data Science Competition`;
  const resolvedDescription = description ?? DEFAULT_DESCRIPTION;

  return {
    ...baseMetadata,
    title: fullTitle,
    description: resolvedDescription,
    keywords,
    alternates: {
      canonical: pathname ? `${siteUrl}${pathname}` : undefined,
    },
    openGraph: {
      type: "website",
      title: fullTitle,
      description: resolvedDescription,
      ...(image ? { images: [{ url: image, alt: title }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: fullTitle,
      description: resolvedDescription,
      ...(image ? { images: [image] } : {}),
    },
  };
}
