import { type ReactNode, useEffect } from 'react'
import { QueryClientProvider, useQueryClient } from '@tanstack/react-query'
import type { Session } from '@supabase/supabase-js'
import { queryClient } from '@/lib/query'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { Toaster } from '@/components/ui/sonner'
import { authService } from '@/features/auth/services'
import { authSessionQueryKey } from '@/features/auth/hooks'

function AuthSyncProvider({ children }: { children: ReactNode }) {
    const qc = useQueryClient()

    useEffect(() => {
        const {
            data: { subscription },
        } = authService.onAuthStateChange(async (_event, session) => {
            qc.setQueryData<Session | null>(authSessionQueryKey, session)
        })

        return () => subscription.unsubscribe()
    }, [qc])

    return <>{children}</>
}

interface AppProvidersProps {
    children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
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
