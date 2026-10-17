import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.signOut()
    if (error) return new NextResponse('Unable to sign out', { status: 500 })
    return NextResponse.redirect(new URL('/login', request.url), 303)
}
