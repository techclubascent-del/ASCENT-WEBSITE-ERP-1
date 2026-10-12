// ─────────────────────────────────────────────────────────────────────────────
// Next.js Middleware — Route Protection
//
// This middleware runs on every request and enforces authentication for
// protected routes. It also refreshes the Supabase session token.
//
// Route groups:
//   /                → public (no auth required)
//   /auth/*          → public (redirects to dashboard if already logged in)
//   /dashboard/*     → protected (redirects to login if unauthenticated)
//   /opportunities/* → protected
//   /applications/*  → protected
//   /profile/*       → protected
//   /admin/*         → protected (role check happens server-side in layout)
// ─────────────────────────────────────────────────────────────────────────────
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/opportunities",
  "/applications",
  "/profile",
  "/admin",
];

const AUTH_PREFIXES = ["/auth"];

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: import("next/dist/compiled/@edge-runtime/cookies").CookieListItem }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refresh the session — important for SSR
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const hostname = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;
  
  // Subdomain routing
  let currentPathname = pathname;
  if (hostname.startsWith("admin.")) {
    if (pathname === "/") {
       currentPathname = "/admin";
    } else if (!pathname.startsWith("/admin")) {
       currentPathname = `/admin${pathname}`;
    }
    
    if (currentPathname !== pathname) {
       return NextResponse.rewrite(new URL(currentPathname, request.url));
    }
  }

  const isProtected = PROTECTED_PREFIXES.some((p) => currentPathname.startsWith(p));
  const isAuthRoute = AUTH_PREFIXES.some((p) => currentPathname.startsWith(p)) || currentPathname.startsWith("/admin/auth");

  // Unauthenticated user trying to access a protected route → redirect to login
  if (!user && isProtected && !isAuthRoute) {
    const loginUrl = request.nextUrl.clone();
    if (hostname.startsWith("admin.")) {
      loginUrl.pathname = "/auth/login"; // the browser will navigate to admin.localhost/auth/login, which middleware then rewrites to /admin/auth/login
    } else {
      loginUrl.pathname = "/auth/login";
    }
    loginUrl.searchParams.set("redirectTo", currentPathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated user visiting an auth page → redirect to dashboard
  if (user && isAuthRoute) {
    const dashboardUrl = request.nextUrl.clone();
    if (hostname.startsWith("admin.")) {
      dashboardUrl.pathname = "/"; // becomes /admin
    } else {
      dashboardUrl.pathname = "/dashboard";
    }
    return NextResponse.redirect(dashboardUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
