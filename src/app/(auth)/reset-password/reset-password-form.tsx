'use client'

import { useEffect, useState } from 'react'
import { AuthForm } from '../auth-form'
import { getSupabaseBrowserClient } from '@/lib/supabase/browser'

export function ResetPasswordForm() {
    const [valid, setValid] = useState<boolean | null>(null)

    useEffect(() => {
        getSupabaseBrowserClient()
            .auth.getUser()
            .then(({ data }) => setValid(!!data.user))
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
                <a className="underline underline-offset-4" href="/forgot-password">
                    Request a new password reset
                </a>
            </main>
        )
    }

    return (
        <main className="mx-auto flex min-h-dvh max-w-md items-center px-6">
            <AuthForm mode="reset" />
        </main>
    )
}
