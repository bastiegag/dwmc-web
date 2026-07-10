import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHookWithQuery, waitFor } from '@/test/utils/render'
import { useCreateAccount } from '@/features/accounts/hooks/use-create-account'
import { accountQueryKeys } from '@/features/accounts/hooks/use-accounts'

describe('useCreateAccount', () => {
    beforeEach(() => {
        vi.stubEnv('VITE_API_URL', 'http://localhost:8787')
    })

    it('invalidates the accounts list after a successful create', async () => {
        const { result, qc } = renderHookWithQuery(() => useCreateAccount())
        const invalidateSpy = vi.spyOn(qc, 'invalidateQueries')

        await result.current.mutateAsync({
            name: 'Cash',
            color: '#0f172a',
            icon: 'wallet',
        })

        await waitFor(() => {
            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: accountQueryKeys.lists() })
        })
    })
})
