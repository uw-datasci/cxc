import { RaftResponse } from "@uw-datasci/raft";
import { NextResponse, type NextRequest } from "next/server";
import { COMING_SOON_PATH, siteConfig } from "@/config/site";
import { auth } from "@/lib/auth/server";

const requireSession = auth.middleware({ loginUrl: "/sign-in" });

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (siteConfig.comingSoon && pathname !== COMING_SOON_PATH) {
    if (pathname === "/api" || pathname.startsWith("/api/")) return RaftResponse.notFound();
    return NextResponse.redirect(new URL(COMING_SOON_PATH, request.url));
  }

  if (pathname === "/admin" || pathname.startsWith("/admin/")) return requireSession(request);

  return NextResponse.next();
}

export const config = {
  // Every route except Next internals and static files from public/ (favicon, /home/*
  // landing-page assets). Don't exclude by file extension: a dynamic route such as
  // /api/auth/[...path] would then be reachable as /api/auth/anything.json.
  matcher: ["/((?!_next/|__nextjs|favicon\\.ico$|home/).*)"],
};
