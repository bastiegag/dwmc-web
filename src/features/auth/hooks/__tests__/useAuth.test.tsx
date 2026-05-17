import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuth } from '@/features/auth/hooks/useAuth'

function createWrapper() {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } })
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

    it('unmounting does not throw', async () => {
        const { unmount } = renderHook(() => useAuth(), { wrapper: createWrapper() })
        expect(() => unmount()).not.toThrow()
    })
})
