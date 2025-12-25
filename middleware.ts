import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_LOCALE, isLocale } from "@/utils/i18n-core";
import { updateSession } from "@/lib/supabase/middleware";
import { createServerClient } from '@supabase/ssr';
import type { CookieOptions } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const lang = url.searchParams.get("lang");

  // Handle language switching
  if (isLocale(lang)) {
    const nextUrl = new URL(url);
    nextUrl.searchParams.delete("lang");

    const response = NextResponse.redirect(nextUrl);
    response.cookies.set("locale", lang, { path: "/" });
    return response;
  }

  // Update Supabase session
  let response = await updateSession(request);

  // Set default locale if not exists
  const existing = request.cookies.get("locale")?.value;
  if (!existing) {
    response.cookies.set("locale", DEFAULT_LOCALE, { path: "/" });
  }

  // Protected routes that require authentication
  const protectedRoutes = [
    '/scouts',
    '/scout',
    '/settings',
    '/admin',
  ];

  const isProtectedRoute = protectedRoutes.some(route => 
    url.pathname.startsWith(route)
  );

  // Check authentication for protected routes
  if (isProtectedRoute) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            response.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name: string, options: CookieOptions) {
            response.cookies.set({
              name,
              value: '',
              ...options,
            });
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    // Redirect to login page if not authenticated
    if (!user) {
      const redirectUrl = new URL('/login', url.origin);
      // Preserve the original URL to redirect back after login
      redirectUrl.searchParams.set('redirectTo', url.pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
