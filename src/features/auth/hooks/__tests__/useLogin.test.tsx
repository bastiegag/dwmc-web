import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode } from 'react'
import { useLogin } from '@/features/auth/hooks/useLogin'

vi.mock('@/components/ui/use-toast', () => ({ toast: vi.fn() }))

function createWrapper() {
    const qc = new QueryClient({
        defaultOptions: { mutations: { retry: false }, queries: { retry: false, gcTime: 0 } },
    })
    return ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    )
}

describe('useLogin', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('exposes login function and isPending: false initially', () => {
        const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() })
        expect(typeof result.current.login).toBe('function')
        expect(result.current.isPending).toBe(false)
    })

    it('resolves for valid credentials', async () => {
        const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() })
        await expect(
            result.current.login({ email: 'test@example.com', password: 'Password123' }),
        ).resolves.toBeDefined()
    })

    it('rejects and calls toast with destructive variant for invalid credentials', async () => {
        const { toast } = await import('@/components/ui/use-toast')
        const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() })
        await expect(
            result.current.login({ email: 'test@example.com', password: 'wrongpassword' }),
        ).rejects.toThrow()
        await waitFor(() => {
            expect(toast).toHaveBeenCalledWith(expect.objectContaining({ variant: 'destructive' }))
        })
    })
})
