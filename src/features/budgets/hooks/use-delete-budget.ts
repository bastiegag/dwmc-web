import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteBudget } from '@/features/budgets/api/budgets.api'
import { budgetQueryKeys } from './use-budgets'

export function useDeleteBudget() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => deleteBudget(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: budgetQueryKeys.lists() })
            await queryClient.invalidateQueries({ queryKey: ['dashboard'] })
        },
    })
}
