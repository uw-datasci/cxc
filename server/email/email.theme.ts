/**
 * Resolved CxC email design tokens.
 *
 * Email clients do not load the website's globals.css or its `next/font` fonts, so
 * email templates need concrete values rather than CSS variables. Keep the colors
 * aligned with the palette in app/globals.css (and the design system guide in
 * .github/context/design-system.md); the names below match the brand palette names.
 */
export const emailColours = {
  background: "#e8e8e8",
  border: "#cecece",
  card: "#f7f7f7",
  foreground: "#101010",
  muted: "#757271",
  primary: "#1b66ff",
  darkGrey: "#333130",
} as const;

/**
 * Email-safe font stacks.
 *
 * The site uses Alte Haas Grotesk and Atkinson Hyperlegible Mono, which email clients
 * cannot load, so each role falls back to a system family with the same character:
 * a neutral grotesk for headings and body, a monospace for labels and metadata.
 */
export const emailFonts = {
  sans: "Helvetica, Arial, sans-serif",
  mono: "'Courier New', Courier, monospace",
} as const;

/** Identity shown in every email's header and footer. */
export const emailBrand = {
  name: "CxC",
  organization: "UWaterloo Data Science Club",
  siteUrl: "https://cxc.uwdatascience.ca",
  siteLabel: "cxc.uwdatascience.ca",
} as const;
