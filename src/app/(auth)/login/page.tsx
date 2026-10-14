'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase/browser'

export default function LoginPage() {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [pending, setPending] = useState(false)

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setPending(true)
        setError(null)
        const form = new FormData(event.currentTarget)
        const { error: signInError } = await getSupabaseBrowserClient().auth.signInWithPassword({
            email: String(form.get('email')),
            password: String(form.get('password')),
        })
        setPending(false)
        if (signInError) {
            setError(signInError.message)
            return
        }
        router.replace('/protected-proof')
        router.refresh()
    }

    return (
        <main className="mx-auto flex min-h-dvh max-w-md items-center px-6">
            <form onSubmit={onSubmit} className="w-full space-y-4">
                <h1 className="text-heading-xl font-bold">Sign in</h1>
                <input name="email" type="email" required autoComplete="email" />
                <input name="password" type="password" required autoComplete="current-password" />
                {error ? <p role="alert">{error}</p> : null}
                <button type="submit" disabled={pending}>
                    {pending ? 'Signing in...' : 'Sign in'}
                </button>
            </form>
        </main>
    )
}
