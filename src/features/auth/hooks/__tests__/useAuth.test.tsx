import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuth, authSessionQueryKey } from '@/features/auth/hooks/useAuth'
import type { Session } from '@supabase/supabase-js'

const createWrapper = (seed?: Session | null) => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } })
    if (seed !== undefined) {
        qc.setQueryData(authSessionQueryKey, seed)
    }
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    )
}

describe('useAuth', () => {
    it('starts with isLoading true', () => {
        const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() })
        expect(result.current.isLoading).toBe(true)
    })

    it('resolves to unauthenticated state when there is no stored session', async () => {
        const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() })
        await waitFor(() => expect(result.current.isLoading).toBe(false))
        expect(result.current.user).toBeNull()
        expect(result.current.isAuthenticated).toBe(false)
    })

    it('returns authenticated state when cache is pre-seeded with a session', () => {
        const mockSession = {
            user: { id: 'u1', email: 'alice@example.com' },
            access_token: 'tok',
        } as unknown as Session
        const { result } = renderHook(() => useAuth(), { wrapper: createWrapper(mockSession) })
        // staleTime: Infinity — no fetch, resolves immediately from cache
        expect(result.current.isLoading).toBe(false)
        expect(result.current.isAuthenticated).toBe(true)
        expect(result.current.user?.email).toBe('alice@example.com')
        expect(result.current.session?.access_token).toBe('tok')
    })

    it('unmounting does not throw', async () => {
        const { unmount } = renderHook(() => useAuth(), { wrapper: createWrapper() })
        expect(() => unmount()).not.toThrow()
    })
})
