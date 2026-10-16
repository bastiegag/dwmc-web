import { type ReactNode, useEffect } from 'react'
import { QueryClientProvider, useQueryClient } from '@tanstack/react-query'
import type { Session } from '@supabase/supabase-js'
import { queryClient } from '@/lib/query'
import { ThemeProvider } from '@/shared/theme'
import { Toaster } from '@/components/ui/sonner'
import { authService } from '@/features/auth/services'
import { authSessionQueryKey } from '@/features/auth/hooks'
import { configureBrowserApiAdapter } from '@/lib/browser-api-adapter'

export const AuthSyncProvider = ({ children }: { children: ReactNode }) => {
    const qc = useQueryClient()

    useEffect(() => {
        const {
            data: { subscription },
        } = authService.onAuthStateChange(async (_event, session) => {
            const previousSession = qc.getQueryData<Session | null>(authSessionQueryKey)
            const previousUserId = previousSession?.user?.id
            const nextUserId = session?.user?.id

            if (!session || (previousUserId && previousUserId !== nextUserId)) {
                await qc.cancelQueries()
                qc.removeQueries({
                    predicate: (query) => query.queryKey[0] !== authSessionQueryKey[0],
                })
            }
            qc.setQueryData<Session | null>(authSessionQueryKey, session)
        })

        return () => subscription.unsubscribe()
    }, [qc])

    return <>{children}</>
}

interface AppProvidersProps {
    children: ReactNode
}

export const AppProviders = ({ children }: AppProvidersProps) => {
    configureBrowserApiAdapter({
        baseUrl: import.meta.env.VITE_API_URL,
        getAccessToken: async () => {
            const session = await authService.getSession()
            return session?.access_token
        },
        onUnauthorized: async () => {
            await authService.logout()
        },
    })

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider defaultTheme="system" storageKey="dwmc-theme">
                <AuthSyncProvider>
                    {children}
                    <Toaster />
                </AuthSyncProvider>
            </ThemeProvider>
        </QueryClientProvider>
    )
}
