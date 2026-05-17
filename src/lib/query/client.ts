import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            retry: (failureCount, error) => {
                // Supabase AuthError (and any future HTTP-aware error) carries a
                // numeric `status` field.  Client errors (4xx) are not retryable.
                const status = (error as { status?: unknown }).status
                if (typeof status === 'number' && status < 500) return false
                return failureCount < 3
            },
        },
        mutations: { retry: false },
    },
})
