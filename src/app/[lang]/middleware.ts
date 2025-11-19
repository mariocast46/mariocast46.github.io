// src/app/middleware.ts
import { NextResponse, NextRequest } from "next/server";

const LOCALE_PREFIX = /^(?:\/(en|es))(?:\/|$)/i;

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // ignora assets/next/api…
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/assets")
  ) {
    return NextResponse.next();
  }

  // si NO empieza por /en o /es -> redirige a /en + pathname
  if (!LOCALE_PREFIX.test(pathname)) {
    const url = req.nextUrl.clone();
    // intenta respetar cookie lang si existe, si no "en"
    const cookieLang = req.cookies.get("lang")?.value === "es" ? "es" : "en";
    url.pathname = `/${cookieLang}${pathname}`;
    // conserva la query
    url.search = search;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // aplica a todo salvo estáticos
    "/((?!_next|favicon|images|assets|api).*)",
  ],
};
