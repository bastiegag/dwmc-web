import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHookWithQuery, waitFor } from '@/test/utils/render'
import { useUpdateAccount } from '@/features/accounts/hooks/use-update-account'
import { accountQueryKeys } from '@/features/accounts/hooks/use-accounts'

describe('useUpdateAccount', () => {
    beforeEach(() => {
        vi.stubEnv('VITE_API_URL', 'http://localhost:8787')
    })

    it('invalidates the accounts list and detail after a successful update', async () => {
        const { result, qc } = renderHookWithQuery(() => useUpdateAccount())
        const invalidateSpy = vi.spyOn(qc, 'invalidateQueries')

        await result.current.mutateAsync({
            id: 'a1',
            input: {
                name: 'Updated Checking',
            },
        })

        await waitFor(() => {
            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: accountQueryKeys.lists() })
            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: accountQueryKeys.detail('a1') })
        })
    })
})
