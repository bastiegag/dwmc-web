import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHookWithQuery, waitFor } from '@/test/utils/render'
import { useUpdateTransaction } from '@/features/transactions/hooks/use-update-transaction'
import { transactionQueryKeys } from '@/features/transactions/hooks/use-transactions'
import { accountQueryKeys } from '@/features/accounts/hooks/use-accounts'
import { budgetQueryKeys } from '@/features/budgets/hooks/use-budgets'
import { dashboardQueryKeys } from '@/features/dashboard'

describe('useUpdateTransaction', () => {
    beforeEach(() => {
        vi.stubEnv('VITE_API_URL', 'http://localhost:8787')
    })

    it('invalidates affected queries after a successful update', async () => {
        const { result, qc } = renderHookWithQuery(() => useUpdateTransaction())
        const invalidateSpy = vi.spyOn(qc, 'invalidateQueries')

        await result.current.mutateAsync({
            id: 'tx-1',
            input: {
                amount: 52.5,
                note: 'Updated note',
            },
        })

        await waitFor(() => {
            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: transactionQueryKeys.lists() })
            expect(invalidateSpy).toHaveBeenCalledWith({
                queryKey: transactionQueryKeys.detail('tx-1'),
            })
            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: accountQueryKeys.lists() })
            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: budgetQueryKeys.lists() })
            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: dashboardQueryKeys.lists() })
        })
    })
})
