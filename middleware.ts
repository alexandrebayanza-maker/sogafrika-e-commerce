import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const pathname = request.nextUrl.pathname;

  // Refresh session (important for cookie management)
  const { data: { session } } = await supabase.auth.getSession();

  // ──────────────────────────────────────────────
  // PUBLIC AUTH PAGES: /admin/login and /admin/signup
  // If already logged in, redirect away from auth pages
  // ──────────────────────────────────────────────
  if (pathname === '/admin/login' || pathname === '/admin/signup') {
    if (session) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profile?.role === 'admin') {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.redirect(new URL('/', request.url));
    }
    return response;
  }

  // ──────────────────────────────────────────────
  // PROTECTED: /admin/* (except login/signup above)
  // Must be logged in AND have admin role
  // ──────────────────────────────────────────────
  if (pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return response;
  }

  // ──────────────────────────────────────────────
  // PROTECTED: /checkout — must be logged in
  // ──────────────────────────────────────────────
  if (pathname.startsWith('/checkout')) {
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    return response;
  }

  // ──────────────────────────────────────────────
  // PROTECTED: /dashboard — must be logged in
  // ──────────────────────────────────────────────
  if (pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    return response;
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/checkout/:path*'],
};
