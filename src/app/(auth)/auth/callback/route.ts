import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

const getSafeNext = (value: string | null) =>
    value?.startsWith('/') && !value.startsWith('//') ? value : '/protected-proof'

export async function GET(request: Request) {
    const url = new URL(request.url)
    const code = url.searchParams.get('code')

    if (code) {
        const supabase = await createSupabaseServerClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) return NextResponse.redirect(new URL('/login?error=callback', url))
    }

    return NextResponse.redirect(new URL(getSafeNext(url.searchParams.get('next')), url))
}
