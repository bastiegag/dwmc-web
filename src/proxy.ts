import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

const protectedPaths = new Set([
    '/dashboard',
    '/transactions',
    '/budgets',
    '/accounts',
    '/categories',
    '/tools',
    '/tools/profile',
    '/tools/settings',
])

export async function proxy(request: NextRequest) {
    let response = NextResponse.next({ request })
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !key) {
        throw new Error(
            'Missing Supabase configuration. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.',
        )
    }

    const supabase = createServerClient(url, key, {
        cookies: {
            getAll: () => request.cookies.getAll(),
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                response = NextResponse.next({ request })
                cookiesToSet.forEach(({ name, value, options }) =>
                    response.cookies.set(name, value, options),
                )
            },
        },
    })

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user && protectedPaths.has(request.nextUrl.pathname)) {
        const loginUrl = request.nextUrl.clone()
        loginUrl.pathname = '/login'
        loginUrl.search = ''
        loginUrl.searchParams.set('next', `${request.nextUrl.pathname}${request.nextUrl.search}`)
        return NextResponse.redirect(loginUrl)
    }

    return response
}

export default proxy

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
