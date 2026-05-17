import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode } from 'react'
import { useLogout } from '@/features/auth/hooks/useLogout'
import { queryClient } from '@/lib/query'
import { authService } from '@/features/auth/services'

vi.mock('@/components/ui/use-toast', () => ({ toast: vi.fn() }))

function createWrapper() {
    const qc = new QueryClient({
        defaultOptions: { mutations: { retry: false }, queries: { retry: false, gcTime: 0 } },
    })
    return ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    )
}

describe('useLogout', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('calls queryClient.clear() and success toast on success', async () => {
        vi.spyOn(authService, 'logout').mockResolvedValueOnce(undefined)
        const clearSpy = vi.spyOn(queryClient, 'clear')
        const { toast } = await import('@/components/ui/use-toast')
        const { result } = renderHook(() => useLogout(), { wrapper: createWrapper() })
        await result.current.logout()
        await waitFor(() => {
            expect(clearSpy).toHaveBeenCalledOnce()
            expect(toast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Signed out' }))
        })
        clearSpy.mockRestore()
    })

    it('rejects and calls destructive toast on error', async () => {
        vi.spyOn(authService, 'logout').mockRejectedValueOnce(new Error('Sign out failed'))
        const { toast } = await import('@/components/ui/use-toast')
        const { result } = renderHook(() => useLogout(), { wrapper: createWrapper() })
        await expect(result.current.logout()).rejects.toThrow()
        await waitFor(() => {
            expect(toast).toHaveBeenCalledWith(expect.objectContaining({ variant: 'destructive' }))
        })
    })
})
