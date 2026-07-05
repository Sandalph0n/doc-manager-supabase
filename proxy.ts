import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy'

export async function proxy(request: NextRequest) {
    // update user's auth session
    const {supabaseResponse, supabaseServerClient} = await updateSession(request)

    const { data } = await supabaseServerClient.auth.getClaims();

    const isLoggedIn = !!(data?.claims)
    const isLoginPage = request.nextUrl.pathname === "/login"


    if (!isLoggedIn && !isLoginPage){ // if not login, and not go to login, then redirec to login
        return NextResponse.redirect(new URL("/login", request.url))
    }

    if (isLoggedIn && isLoginPage){ // if logged in, and go to login page, then redirect to home
        return NextResponse.redirect(new URL("/", request.url))
    }

    return supabaseResponse
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}