/**
 * Resolved CxC email colors.
 *
 * Email clients do not load the website's globals.css, so email templates
 * need concrete values rather than CSS variables. Keep these values aligned
 * with the corresponding tokens in app/globals.css.
 */
export const waitlistEmailColors = {
  background: "#e8e8e8",
  border: "#cecece",
  card: "#f7f7f7",
  foreground: "#101010",
  muted: "#757271",
  primary: "#1b66ff",
} as const;
