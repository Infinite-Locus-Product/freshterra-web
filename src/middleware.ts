import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const STORE_COOKIE = "ft_store_id";
const ONE_YEAR = 60 * 60 * 24 * 365;

const APP_STORE_URL = process.env.NEXT_PUBLIC_APP_STORE_URL;
const PLAY_STORE_URL = process.env.NEXT_PUBLIC_PLAY_STORE_URL;

function isMobileUserAgent(ua: string): "ios" | "android" | null {
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  return null;
}

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // 1. Deeplink redirect: any path under /open redirects to the app store
  //    if user is on mobile, else falls through to web. CLAUDE.md §1.
  if (pathname.startsWith("/open")) {
    const ua = req.headers.get("user-agent") ?? "";
    const platform = isMobileUserAgent(ua);
    if (platform === "ios" && APP_STORE_URL) {
      return NextResponse.redirect(APP_STORE_URL);
    }
    if (platform === "android" && PLAY_STORE_URL) {
      return NextResponse.redirect(PLAY_STORE_URL);
    }
  }

  // 2. store_id cookie management — accept ?store=xyz to set, then strip it.
  const incoming = searchParams.get("store");
  if (incoming) {
    const url = req.nextUrl.clone();
    url.searchParams.delete("store");
    const res = NextResponse.redirect(url);
    res.cookies.set(STORE_COOKIE, incoming, {
      maxAge: ONE_YEAR,
      sameSite: "lax",
      path: "/",
    });
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
