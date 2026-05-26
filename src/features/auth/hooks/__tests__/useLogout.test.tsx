import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode } from 'react'
import { useLogout } from '@/features/auth/hooks/useLogout'
import { authService } from '@/features/auth/services'

vi.mock('sonner', () => ({
    toast: Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn() }),
}))

function createWrapper() {
    const qc = new QueryClient({
        defaultOptions: { mutations: { retry: false }, queries: { retry: false, gcTime: 0 } },
    })
    const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    )
    return { qc, wrapper }
}

describe('useLogout', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('calls queryClient.clear() and success toast on success', async () => {
        vi.spyOn(authService, 'logout').mockResolvedValueOnce(undefined)
        const { toast } = await import('sonner')
        const { qc, wrapper } = createWrapper()
        const clearSpy = vi.spyOn(qc, 'clear')
        const { result } = renderHook(() => useLogout(), { wrapper })
        await result.current.logout()
        await waitFor(() => {
            expect(clearSpy).toHaveBeenCalledOnce()
            expect(toast.success).toHaveBeenCalledWith(
                'Signed out',
                expect.objectContaining({ description: 'You have been signed out.' }),
            )
        })
        clearSpy.mockRestore()
    })

    it('rejects and calls destructive toast on error', async () => {
        vi.spyOn(authService, 'logout').mockRejectedValueOnce(new Error('Sign out failed'))
        const { toast } = await import('sonner')
        const { wrapper } = createWrapper()
        const { result } = renderHook(() => useLogout(), { wrapper })
        await expect(result.current.logout()).rejects.toThrow()
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(
                'Sign out failed',
                expect.objectContaining({ description: expect.any(String) }),
            )
        })
    })
})
