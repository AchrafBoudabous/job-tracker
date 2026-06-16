import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes — skip auth entirely
  const isPublic =
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/auth')

  let user = null

  try {
    // Build a mutable response so Supabase can refresh/write session cookies
    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            )
            supabaseResponse = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    // Always use getUser() — never getSession() — for auth verification.
    // getUser() hits the Supabase Auth server to validate the JWT cryptographically.
    const { data } = await supabase.auth.getUser()
    user = data.user

    if (isPublic) {
      if (user && (pathname === '/login' || pathname === '/signup')) {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
      }
      return supabaseResponse
    }

    if (user) return supabaseResponse
  } catch (err) {
    // If Supabase is unreachable or misconfigured, log and fall through to the
    // unauthenticated redirect rather than returning a 500.
    console.error('[proxy] auth check failed:', err)
  }

  // Unauthenticated (or Supabase error) → send to login
  if (!isPublic) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return NextResponse.next({ request })
}

export const config = {
  matcher: [
    // Run on every path except Next.js internals and static assets
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
