import { auth } from "@/lib/auth/server";

export default auth.middleware({ loginUrl: "/sign-in" });

// Only /admin requires a session. Everything else is public — pages vary their
// content by role instead, via getAuthContext(), which returns null for guests.
// Role checks are NOT done here; each /admin page calls requireRole itself.
export const config = {
  matcher: ["/admin/:path*"],
};
