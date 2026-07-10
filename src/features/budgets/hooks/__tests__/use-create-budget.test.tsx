import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHookWithQuery, waitFor } from '@/test/utils/render'
import { useCreateBudget } from '@/features/budgets/hooks/use-create-budget'
import { budgetQueryKeys } from '@/features/budgets/hooks/use-budgets'

describe('useCreateBudget', () => {
    beforeEach(() => {
        vi.stubEnv('VITE_API_URL', 'http://localhost:8787')
    })

    it('invalidates budgets and dashboard after a successful create', async () => {
        const { result, qc } = renderHookWithQuery(() => useCreateBudget())
        const invalidateSpy = vi.spyOn(qc, 'invalidateQueries')

        await result.current.mutateAsync({
            categoryId: 'cat-1',
            month: '2026-06',
            amount: 250,
        })

        await waitFor(() => {
            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: budgetQueryKeys.lists() })
            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['dashboard'] })
        })
    })
})
