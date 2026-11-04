import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHookWithQuery, waitFor } from '@/test/utils/render'
import { useDeleteBudget } from '@/features/budgets/hooks/use-delete-budget'
import { budgetQueryKeys } from '@/features/budgets/hooks/use-budgets'
import { dashboardQueryKeys } from '@/features/dashboard'

describe('useDeleteBudget', () => {
    beforeEach(() => {
        vi.stubEnv('VITE_API_URL', 'http://localhost:8787')
    })

    it('invalidates budgets and dashboard after a successful delete', async () => {
        const { result, qc } = renderHookWithQuery(() => useDeleteBudget())
        const invalidateSpy = vi.spyOn(qc, 'invalidateQueries')

        await result.current.mutateAsync('bud-1')

        await waitFor(() => {
            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: budgetQueryKeys.lists() })
            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: dashboardQueryKeys.lists() })
        })
    })
})
