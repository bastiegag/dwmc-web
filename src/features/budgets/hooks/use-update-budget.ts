import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateBudget } from '@/features/budgets/api/budgets.api'
import { budgetQueryKeys } from './use-budgets'
import type { UpdateBudgetPayload } from '@/features/budgets/types/budget.types'
import { dashboardQueryKeys } from '@/features/dashboard'

export const useUpdateBudget = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: UpdateBudgetPayload }) =>
            updateBudget(id, input),
        onSuccess: async (_data, variables) => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: budgetQueryKeys.lists() }),
                queryClient.invalidateQueries({ queryKey: budgetQueryKeys.detail(variables.id) }),
                queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.lists() }),
            ])
        },
    })
}
