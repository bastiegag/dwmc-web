import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHookWithQuery, waitFor } from '@/test/utils/render'
import { useCreateTransaction } from '@/features/transactions/hooks/use-create-transaction'
import { transactionQueryKeys } from '@/features/transactions/hooks/use-transactions'
import { accountQueryKeys } from '@/features/accounts/hooks/use-accounts'
import { budgetQueryKeys } from '@/features/budgets/hooks/use-budgets'
import { dashboardQueryKeys } from '@/features/dashboard'

describe('useCreateTransaction', () => {
    beforeEach(() => {
        vi.stubEnv('VITE_API_URL', 'http://localhost:8787')
    })

    it('invalidates affected queries after a successful create', async () => {
        const { result, qc } = renderHookWithQuery(() => useCreateTransaction())
        const invalidateSpy = vi.spyOn(qc, 'invalidateQueries')

        await result.current.mutateAsync({
            type: 'EXPENSE',
            amount: 42.5,
            date: '2026-06-15',
            accountId: 'a1',
            categoryId: 'cat-1',
            merchant: 'Grocer',
            note: null,
        })

        await waitFor(() => {
            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: transactionQueryKeys.lists() })
            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: accountQueryKeys.lists() })
            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: budgetQueryKeys.lists() })
            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: dashboardQueryKeys.lists() })
        })
    })
})
