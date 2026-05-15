import { useEffect, useState } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { authService } from '@/features/auth/services'

export function useAuth() {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        authService.getSession().then((session) => {
            setSession(session)
            setUser(session?.user ?? null)
            setIsLoading(false)
        })

        const {
            data: { subscription },
        } = authService.onAuthStateChange(async (_event, session) => {
            setSession(session)
            setUser(session?.user ?? null)
            setIsLoading(false)
        })

        return () => subscription.unsubscribe()
    }, [])

    return { user, session, isLoading, isAuthenticated: !!user }
}
