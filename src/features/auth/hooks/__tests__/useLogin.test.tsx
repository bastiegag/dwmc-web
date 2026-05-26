import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode } from 'react'
import { useLogin } from '@/features/auth/hooks/useLogin'

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

    it('rejects for invalid credentials', async () => {
        const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() })
        await expect(
            result.current.login({ email: 'test@example.com', password: 'wrongpassword' }),
        ).rejects.toThrow()
    })
})
