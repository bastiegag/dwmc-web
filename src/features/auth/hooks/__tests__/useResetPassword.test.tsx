import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode } from 'react'
import { useResetPassword } from '@/features/auth/hooks/useResetPassword'
import { authService } from '@/features/auth/services'

vi.mock('sonner', () => ({
    toast: Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn() }),
}))

const createWrapper = () => {
    const qc = new QueryClient({
        defaultOptions: { mutations: { retry: false }, queries: { retry: false, gcTime: 0 } },
    })
    return ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    )
}

const mockUser = {
    id: 'mock-user-id',
    email: 'test@example.com',
    aud: 'authenticated',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    app_metadata: {},
    user_metadata: {},
} as never

describe('useResetPassword', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('sets isSuccess to true and calls success toast on success', async () => {
        vi.spyOn(authService, 'resetPassword').mockResolvedValueOnce({ user: mockUser })
        const { toast } = await import('sonner')
        const { result } = renderHook(() => useResetPassword(), { wrapper: createWrapper() })
        await result.current.resetPassword('NewPassword123')
        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true)
            expect(toast.success).toHaveBeenCalledWith('Password updated', expect.any(Object))
        })
    })

    it('rejects on error (error handling delegated to caller)', async () => {
        vi.spyOn(authService, 'resetPassword').mockRejectedValueOnce(new Error('Server error'))
        const { result } = renderHook(() => useResetPassword(), { wrapper: createWrapper() })
        await expect(result.current.resetPassword('NewPassword123')).rejects.toThrow()
    })
})
