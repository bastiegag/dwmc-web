import { describe, it, expect } from 'vitest'
import { useAuth, authSessionQueryKey } from '@/features/auth/hooks/useAuth'
import type { Session } from '@supabase/supabase-js'
import { renderHookWithQuery, waitFor } from '@/test/utils/render'

describe('useAuth', () => {
    it('starts with isLoading true', () => {
        const { result } = renderHookWithQuery(() => useAuth())
        expect(result.current.isLoading).toBe(true)
    })

    it('resolves to unauthenticated state when there is no stored session', async () => {
        const { result } = renderHookWithQuery(() => useAuth())
        await waitFor(() => expect(result.current.isLoading).toBe(false))
        expect(result.current.user).toBeNull()
        expect(result.current.isAuthenticated).toBe(false)
    })

    it('returns authenticated state when cache is pre-seeded with a session', () => {
        const mockSession = {
            user: { id: 'u1', email: 'alice@example.com' },
            access_token: 'tok',
        } as unknown as Session
        const { result } = renderHookWithQuery(() => useAuth(), {
            setupClient: (qc) => qc.setQueryData(authSessionQueryKey, mockSession),
        })
        // staleTime: Infinity — no fetch, resolves immediately from cache
        expect(result.current.isLoading).toBe(false)
        expect(result.current.isAuthenticated).toBe(true)
        expect(result.current.user?.email).toBe('alice@example.com')
        expect(result.current.session?.access_token).toBe('tok')
    })

    it('unmounting does not throw', async () => {
        const { unmount } = renderHookWithQuery(() => useAuth())
        expect(() => unmount()).not.toThrow()
    })
})
