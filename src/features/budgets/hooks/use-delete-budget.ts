import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteBudget } from '@/features/budgets/api/budgets.api'
import { budgetQueryKeys } from './use-budgets'
import { dashboardQueryKeys } from '@/features/dashboard'

export const useDeleteBudget = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => deleteBudget(id),
        onSuccess: async (_data, id) => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: budgetQueryKeys.lists() }),
                queryClient.invalidateQueries({ queryKey: budgetQueryKeys.detail(id) }),
                queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.lists() }),
            ])
        },
    })
}
