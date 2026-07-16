import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHookWithQuery, waitFor } from '@/test/utils/render'
import { useDeleteAccount } from '@/features/accounts/hooks/use-delete-account'
import { accountQueryKeys } from '@/features/accounts/hooks/use-accounts'

describe('useDeleteAccount', () => {
    beforeEach(() => {
        vi.stubEnv('VITE_API_URL', 'http://localhost:8787')
    })

    it('invalidates the accounts list after a successful delete', async () => {
        const { result, qc } = renderHookWithQuery(() => useDeleteAccount())
        const invalidateSpy = vi.spyOn(qc, 'invalidateQueries')

        await result.current.mutateAsync('a1')

        await waitFor(() => {
            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: accountQueryKeys.lists() })
        })
    })
})
