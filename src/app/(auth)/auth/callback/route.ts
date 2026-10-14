import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getSafeAuthRedirect } from '@/lib/auth-redirect'

export async function GET(request: Request) {
    const url = new URL(request.url)
    const code = url.searchParams.get('code')

    if (!code) return NextResponse.redirect(new URL('/login?error=missing_callback', url))

    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) return NextResponse.redirect(new URL('/login?error=invalid_callback', url))

    return NextResponse.redirect(new URL(getSafeAuthRedirect(url.searchParams.get('next')), url))
}
