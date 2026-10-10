import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useResetPassword } from '@/features/auth/hooks'
import { authService } from '@/features/auth/services'
import { renderHookWithQuery, waitFor } from '@/test/utils/render'

vi.mock('sonner', () => ({
    toast: Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn() }),
}))

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
        const { result } = renderHookWithQuery(() => useResetPassword())
        await result.current.resetPassword('NewPassword123')
        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true)
            expect(toast.success).toHaveBeenCalledWith('Password updated', expect.any(Object))
        })
    })

    it('rejects on error (error handling delegated to caller)', async () => {
        vi.spyOn(authService, 'resetPassword').mockRejectedValueOnce(new Error('Server error'))
        const { result } = renderHookWithQuery(() => useResetPassword())
        await expect(result.current.resetPassword('NewPassword123')).rejects.toThrow()
    })
})
