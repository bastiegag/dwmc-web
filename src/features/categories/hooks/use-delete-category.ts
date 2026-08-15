import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteCategory } from '@/features/categories/api'
import { categoryQueryKeys, sectionQueryKeys } from './use-sections'
import { dashboardQueryKeys } from '@/features/dashboard'

export const useDeleteCategory = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => deleteCategory(id),
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: categoryQueryKeys.lists() }),
                queryClient.invalidateQueries({ queryKey: sectionQueryKeys.lists() }),
                queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.lists() }),
            ])
        },
    })
}
