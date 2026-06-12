import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createBudget } from '@/features/budgets/api/budgets.api'
import { budgetQueryKeys } from './use-budgets'
import type { CreateBudgetPayload } from '@/features/budgets/types/budget.types'

export function useCreateBudget() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (input: CreateBudgetPayload) => createBudget(input),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: budgetQueryKeys.lists() })
            await queryClient.invalidateQueries({ queryKey: ['dashboard'] })
        },
    })
}
