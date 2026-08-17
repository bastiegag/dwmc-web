import { type ReactNode, useEffect } from 'react'
import { QueryClientProvider, useQueryClient } from '@tanstack/react-query'
import type { Session } from '@supabase/supabase-js'
import { queryClient } from '@/lib/query'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { Toaster } from '@/components/ui/sonner'
import { authService } from '@/features/auth/services'
import { authSessionQueryKey } from '@/features/auth/hooks'

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

export const AppProviders = ({ children }: AppProvidersProps) => (
    <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system" storageKey="dwmc-theme">
            <AuthSyncProvider>
                {children}
                <Toaster />
            </AuthSyncProvider>
        </ThemeProvider>
    </QueryClientProvider>
)
