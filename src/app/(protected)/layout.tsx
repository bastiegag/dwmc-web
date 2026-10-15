import { redirect } from 'next/navigation'
import type { ReactNode } from 'react'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { Suspense } from 'react'
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner'
import { ProtectedShell } from './protected-shell'

export default async function ProtectedLayout({ children }: Readonly<{ children: ReactNode }>) {
    const supabase = await createSupabaseServerClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) redirect('/login')
    return (
        <Suspense
            fallback={
                <div className="flex min-h-dvh items-center justify-center">
                    <LoadingSpinner size="lg" aria-label="Loading page" />
                </div>
            }
        >
            <ProtectedShell>{children}</ProtectedShell>
        </Suspense>
    )
}
