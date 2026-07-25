import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function isAdminUser(user: {
  app_metadata?: Record<string, unknown>;
  email?: string | null;
}): boolean {
  if (user.app_metadata?.role === "admin") return true;
  if (user.app_metadata?.super_admin === true) return true;
  const seed = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  if (seed && user.email?.trim().toLowerCase() === seed) return true;
  return false;
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !anonKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isAuthPage =
    path === "/login" || path === "/register" || path.startsWith("/auth/");
  const needsAuth =
    path.startsWith("/upload") ||
    path.startsWith("/profile") ||
    path.startsWith("/admin");
  const needsAdmin = path.startsWith("/admin");

  if (needsAuth && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", path);
    return NextResponse.redirect(loginUrl);
  }

  if (needsAdmin && user && !isAdminUser(user)) {
    const home = request.nextUrl.clone();
    home.pathname = "/";
    home.search = "";
    return NextResponse.redirect(home);
  }

  if (user && (path === "/login" || path === "/register")) {
    const dest = request.nextUrl.clone();
    dest.pathname = isAdminUser(user) ? "/admin" : "/profile";
    dest.search = "";
    return NextResponse.redirect(dest);
  }

  if (isAuthPage) {
    return supabaseResponse;
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
