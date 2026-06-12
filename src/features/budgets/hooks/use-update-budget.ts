import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateBudget } from '@/features/budgets/api/budgets.api'
import { budgetQueryKeys } from './use-budgets'
import type { UpdateBudgetPayload } from '@/features/budgets/types/budget.types'

export function useUpdateBudget() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: UpdateBudgetPayload }) =>
            updateBudget(id, input),
        onSuccess: async (_data, variables) => {
            await queryClient.invalidateQueries({ queryKey: budgetQueryKeys.lists() })
            if (variables && 'id' in variables && variables.id) {
                await queryClient.invalidateQueries({
                    queryKey: budgetQueryKeys.detail(variables.id),
                })
            }
            await queryClient.invalidateQueries({ queryKey: ['dashboard'] })
        },
    })
}
