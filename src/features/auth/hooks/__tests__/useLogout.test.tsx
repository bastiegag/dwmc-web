import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useLogout } from '@/features/auth/hooks/useLogout'
import { authService } from '@/features/auth/services'
import { renderHookWithQuery, waitFor } from '@/test/utils/render'

vi.mock('sonner', () => ({
    toast: Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn() }),
}))

describe('useLogout', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('calls queryClient.removeQueries() and success toast on success', async () => {
        vi.spyOn(authService, 'logout').mockResolvedValueOnce(undefined)
        const { toast } = await import('sonner')
        const { result, qc } = renderHookWithQuery(() => useLogout())
        const removeQueriesSpy = vi.spyOn(qc, 'removeQueries')
        await result.current.logout()
        await waitFor(() => {
            expect(removeQueriesSpy).toHaveBeenCalledOnce()
            expect(toast.success).toHaveBeenCalledWith(
                'Signed out',
                expect.objectContaining({ description: 'You have been signed out.' }),
            )
        })
        removeQueriesSpy.mockRestore()
    })

    it('rejects and calls destructive toast on error', async () => {
        vi.spyOn(authService, 'logout').mockRejectedValueOnce(new Error('Sign out failed'))
        const { toast } = await import('sonner')
        const { result } = renderHookWithQuery(() => useLogout())
        await expect(result.current.logout()).rejects.toThrow()
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(
                'Sign out failed',
                expect.objectContaining({ description: expect.any(String) }),
            )
        })
    })
})
