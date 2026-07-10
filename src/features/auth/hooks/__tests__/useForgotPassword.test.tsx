import { describe, it, expect, vi, beforeEach } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/mocks/server'
import { useForgotPassword } from '@/features/auth/hooks/useForgotPassword'
import { renderHookWithQuery, waitFor } from '@/test/utils/render'

vi.mock('sonner', () => ({
    toast: Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn() }),
}))

describe('useForgotPassword', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('sets isSuccess to true and calls success toast on success', async () => {
        const { toast } = await import('sonner')
        const { result } = renderHookWithQuery(() => useForgotPassword())
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
        const { result } = renderHookWithQuery(() => useForgotPassword())
        await expect(result.current.forgotPassword('test@example.com')).rejects.toThrow()
    })
})
