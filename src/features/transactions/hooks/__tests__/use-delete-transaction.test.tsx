import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHookWithQuery, waitFor } from '@/test/utils/render'
import { useDeleteTransaction } from '@/features/transactions/hooks/use-delete-transaction'
import { transactionQueryKeys } from '@/features/transactions/hooks/use-transactions'
import { accountQueryKeys } from '@/features/accounts/hooks/use-accounts'

describe('useDeleteTransaction', () => {
    beforeEach(() => {
        vi.stubEnv('VITE_API_URL', 'http://localhost:8787')
    })

    it('invalidates transactions and accounts after a successful delete', async () => {
        const { result, qc } = renderHookWithQuery(() => useDeleteTransaction())
        const invalidateSpy = vi.spyOn(qc, 'invalidateQueries')

        await result.current.mutateAsync('tx-1')

        await waitFor(() => {
            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: transactionQueryKeys.lists() })
            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: accountQueryKeys.lists() })
        })
    })
})
