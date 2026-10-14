'use client'

import { useEffect, useState } from 'react'
import { AuthForm } from '../auth-form'
import { getSupabaseBrowserClient } from '@/lib/supabase/browser'

export default function ResetPasswordPage() {
    const [valid, setValid] = useState<boolean | null>(null)

    useEffect(() => {
        const supabase = getSupabaseBrowserClient()
        supabase.auth.getUser().then(({ data }) => setValid(!!data.user))
    }, [])

    if (valid === null) {
        return (
            <main className="mx-auto flex min-h-dvh max-w-md items-center px-6">
                Verifying reset link...
            </main>
        )
    }
    if (!valid) {
        return (
            <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-4 px-6">
                <h1>Link expired or invalid</h1>
                <a href="/forgot-password">Request a new password reset</a>
            </main>
        )
    }
    return (
        <main className="mx-auto flex min-h-dvh max-w-md items-center px-6">
            <AuthForm mode="reset" />
        </main>
    )
}
