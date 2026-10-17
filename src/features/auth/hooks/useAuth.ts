import { useQuery } from '@tanstack/react-query'
import { authService } from '@/features/auth/services'
import { authSessionQueryKey } from '@/lib/auth-session'

export { authSessionQueryKey }

export const useAuth = () => {
    const { data: session = null, isLoading } = useQuery({
        queryKey: authSessionQueryKey,
        queryFn: () => authService.getSession(),
        staleTime: Infinity, // session is kept fresh by AuthSyncProvider via setQueryData on auth state changes
        retry: false,
    })

    const user = session?.user ?? null
    return { user, session, isLoading, isAuthenticated: !!user }
}
