import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getSafeAuthCallbackDestination } from '@/lib/auth-redirect'

export async function GET(request: Request) {
    const url = new URL(request.url)
    const code = url.searchParams.get('code')
    const flow = url.searchParams.get('flow')

    if (!code) return NextResponse.redirect(new URL('/login?error=missing_callback', url))

    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) return NextResponse.redirect(new URL('/login?error=invalid_callback', url))

    const destination = getSafeAuthCallbackDestination(url.searchParams.get('next'), flow)
    const response = NextResponse.redirect(new URL(destination, url))
    if (destination === '/reset-password') {
        response.cookies.set('dwmc-recovery', '1', {
            httpOnly: true,
            maxAge: 600,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            path: '/',
        })
    }
    return response
}
