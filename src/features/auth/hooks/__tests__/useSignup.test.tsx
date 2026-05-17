import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode } from 'react'
import { useSignup } from '@/features/auth/hooks/useSignup'

vi.mock('@/components/ui/use-toast', () => ({ toast: vi.fn() }))

function createWrapper() {
    const qc = new QueryClient({
        defaultOptions: { mutations: { retry: false }, queries: { retry: false, gcTime: 0 } },
    })
    return ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    )
}

describe('useSignup', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('resolves for a new email and calls success toast', async () => {
        const { toast } = await import('@/components/ui/use-toast')
        const { result } = renderHook(() => useSignup(), { wrapper: createWrapper() })
        await expect(
            result.current.signup({ email: 'newuser@example.com', password: 'Password123' }),
        ).resolves.toBeDefined()
        await waitFor(() => {
            expect(toast).toHaveBeenCalledWith(
                expect.objectContaining({ title: 'Account created' }),
            )
        })
    })

    it('rejects for an existing email', async () => {
        const { result } = renderHook(() => useSignup(), { wrapper: createWrapper() })
        await expect(
            result.current.signup({ email: 'existing@example.com', password: 'Password123' }),
        ).rejects.toThrow()
    })
})
