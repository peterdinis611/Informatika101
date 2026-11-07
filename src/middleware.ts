import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { defaultLocale, isLocale, locales } from "@/i18n/config"

const PUBLIC_FILE = /\.(.*)$/

function preferredLocale(request: NextRequest) {
  const cookie = request.cookies.get("NEXT_LOCALE")?.value
  if (cookie && isLocale(cookie)) return cookie

  const header = request.headers.get("accept-language")
  if (!header) return defaultLocale

  const candidates = header
    .split(",")
    .map((part) => part.split(";")[0]?.trim().toLowerCase())
    .filter(Boolean)

  for (const cand of candidates) {
    const base = cand.slice(0, 2)
    if (isLocale(base)) return base
  }
  return defaultLocale
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/opengraph-image") ||
    pathname.startsWith("/icon") ||
    pathname.startsWith("/sitemap") ||
    pathname.startsWith("/robots") ||
    pathname.startsWith("/manifest") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next()
  }

  // Legacy Slovak path → localized lesson
  if (pathname.startsWith("/lekcia/")) {
    const id = pathname.replace("/lekcia/", "")
    const locale = preferredLocale(request)
    return NextResponse.redirect(
      new URL(`/${locale}/lesson/${id}`, request.url)
    )
  }

  // Legacy unprefixed lesson → locale lesson
  if (pathname.startsWith("/lesson/")) {
    const locale = preferredLocale(request)
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url))
  }

  const segment = pathname.split("/")[1]
  if (segment && isLocale(segment)) {
    return NextResponse.next()
  }

  const locale = preferredLocale(request)
  const url = request.nextUrl.clone()
  url.pathname =
    pathname === "/" ? `/${locale}` : `/${locale}${pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}

// Keep locales referenced so tree-shaking doesn't drop the import intent
void locales
