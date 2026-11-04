import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useSignup } from '@/features/auth/hooks'
import { renderHookWithQuery, waitFor } from '@/test/utils/render'

vi.mock('sonner', () => ({
    toast: Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn() }),
}))

describe('useSignup', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('resolves for a new email and calls success toast', async () => {
        const { toast } = await import('sonner')
        const { result } = renderHookWithQuery(() => useSignup())
        await expect(
            result.current.signup({ email: 'newuser@example.com', password: 'Password123' }),
        ).resolves.toBeDefined()
        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith('Account created', expect.any(Object))
        })
    })

    it('rejects for an existing email', async () => {
        const { result } = renderHookWithQuery(() => useSignup())
        await expect(
            result.current.signup({ email: 'existing@example.com', password: 'Password123' }),
        ).rejects.toThrow()
    })
})
