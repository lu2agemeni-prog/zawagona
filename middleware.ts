import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { supabaseResponse, supabase } = updateSession(request)
  
  const { data: { session } } = await supabase.auth.getSession()

  // Protect routes
  const protectedRoutes = ['/dashboard', '/search', '/profile', '/interests', '/ignored', '/interested-in-me', '/premium', '/messages', '/notifications', '/admin']
  const isProtected = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))

  if (isProtected && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  if (request.nextUrl.pathname.startsWith('/onboarding') && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
