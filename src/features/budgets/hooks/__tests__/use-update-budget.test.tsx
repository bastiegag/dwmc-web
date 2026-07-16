import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHookWithQuery, waitFor } from '@/test/utils/render'
import { useUpdateBudget } from '@/features/budgets/hooks/use-update-budget'
import { budgetQueryKeys } from '@/features/budgets/hooks/use-budgets'
import { dashboardQueryKeys } from '@/features/dashboard'

describe('useUpdateBudget', () => {
    beforeEach(() => {
        vi.stubEnv('VITE_API_URL', 'http://localhost:8787')
    })

    it('invalidates budgets, the updated budget, and dashboard after a successful update', async () => {
        const { result, qc } = renderHookWithQuery(() => useUpdateBudget())
        const invalidateSpy = vi.spyOn(qc, 'invalidateQueries')

        await result.current.mutateAsync({
            id: 'bud-1',
            input: { amount: 300 },
        })

        await waitFor(() => {
            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: budgetQueryKeys.lists() })
            expect(invalidateSpy).toHaveBeenCalledWith({
                queryKey: budgetQueryKeys.detail('bud-1'),
            })
            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: dashboardQueryKeys.lists() })
        })
    })
})
