import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, HttpResponse } from 'msw'
import { type ReactNode } from 'react'
import { server } from '@/test/mocks/server'
import { useForgotPassword } from '@/features/auth/hooks/useForgotPassword'

vi.mock('sonner', () => ({
    toast: Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn() }),
}))

function createWrapper() {
    const qc = new QueryClient({
        defaultOptions: { mutations: { retry: false }, queries: { retry: false, gcTime: 0 } },
    })
    return ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    )
}

describe('useForgotPassword', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('sets isSuccess to true and calls success toast on success', async () => {
        const { toast } = await import('sonner')
        const { result } = renderHook(() => useForgotPassword(), { wrapper: createWrapper() })
        await result.current.forgotPassword('test@example.com')
        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true)
            expect(toast.success).toHaveBeenCalledWith('Reset link sent', expect.any(Object))
        })
    })

    it('rejects on server error (error handling delegated to caller)', async () => {
        server.use(
            http.post('https://test.supabase.co/auth/v1/recover', () =>
                HttpResponse.json({ error: 'Server error' }, { status: 500 }),
            ),
        )
        const { result } = renderHook(() => useForgotPassword(), { wrapper: createWrapper() })
        await expect(result.current.forgotPassword('test@example.com')).rejects.toThrow()
    })
})
