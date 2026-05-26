import { useQuery } from '@tanstack/react-query'
import { authService } from '@/features/auth/services'

export const authSessionQueryKey = ['auth', 'session'] as const

export function useAuth() {
    const { data: session = null, isLoading } = useQuery({
        queryKey: authSessionQueryKey,
        queryFn: () => authService.getSession(),
        staleTime: Infinity, // session is kept fresh by AuthSyncProvider via invalidateQueries on auth state changes
        retry: false,
    })

    const user = session?.user ?? null
    return { user, session, isLoading, isAuthenticated: !!user }
}
