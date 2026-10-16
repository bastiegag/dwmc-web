'use client'

import { useEffect } from 'react'
import type { ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { QueryClientProvider, useQueryClient } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/shared/theme'
import { authSessionQueryKey } from '@/lib/auth-session'
import { getSupabaseBrowserClient } from '@/lib/supabase/browser'
import { queryClient } from '@/lib/query'
import { configureBrowserApiAdapter } from '@/lib/browser-api-adapter'

function AuthSessionSync({ children }: Readonly<{ children: ReactNode }>) {
    const client = useQueryClient()

    useEffect(() => {
        const {
            data: { subscription },
        } = getSupabaseBrowserClient().auth.onAuthStateChange(async (_event, session) => {
            const previous = client.getQueryData<Session | null>(authSessionQueryKey)
            if (!session || previous?.user?.id !== session.user?.id) {
                await client.cancelQueries()
                client.removeQueries({
                    predicate: (query) => query.queryKey[0] !== authSessionQueryKey[0],
                })
            }
            client.setQueryData(authSessionQueryKey, session)
        })
        return () => subscription.unsubscribe()
    }, [client])

    return children
}

export function AppProviders({ children }: Readonly<{ children: ReactNode }>) {
    configureBrowserApiAdapter({
        baseUrl: '/api/v1',
        getAccessToken: async () => {
            const {
                data: { session },
            } = await getSupabaseBrowserClient().auth.getSession()
            return session?.access_token
        },
        onUnauthorized: async () => {
            await getSupabaseBrowserClient().auth.signOut()
        },
    })

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider defaultTheme="system" storageKey="dwmc-theme">
                <AuthSessionSync>
                    {children}
                    <Toaster />
                </AuthSessionSync>
            </ThemeProvider>
        </QueryClientProvider>
    )
}
