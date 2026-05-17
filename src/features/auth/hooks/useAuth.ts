import { useEffect, useState } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { authService } from '@/features/auth/services'

export function useAuth() {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        let ignore = false

        authService.getSession().then((session) => {
            if (ignore) return
            setSession(session)
            setUser(session?.user ?? null)
            setIsLoading(false)
        })

        const {
            data: { subscription },
        } = authService.onAuthStateChange(async (_event, session) => {
            ignore = true
            setSession(session)
            setUser(session?.user ?? null)
            setIsLoading(false)
        })

        return () => {
            ignore = true
            subscription.unsubscribe()
        }
    }, [])

    return { user, session, isLoading, isAuthenticated: !!user }
}
