import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateCategory } from '@/features/categories/api'
import type { UpdateCategoryInput } from '@/features/categories/types'
import { budgetQueryKeys } from '@/features/budgets'
import { categoryQueryKeys, sectionQueryKeys } from './use-sections'
import { dashboardQueryKeys } from '@/features/dashboard'
import { transactionQueryKeys } from '@/features/transactions'

export const useUpdateCategory = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: UpdateCategoryInput }) =>
            updateCategory(id, input),
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: categoryQueryKeys.lists() }),
                queryClient.invalidateQueries({ queryKey: sectionQueryKeys.lists() }),
                queryClient.invalidateQueries({ queryKey: transactionQueryKeys.lists() }),
                queryClient.invalidateQueries({ queryKey: budgetQueryKeys.lists() }),
                queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.lists() }),
            ])
        },
    })
}
