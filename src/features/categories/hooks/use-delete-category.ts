import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteCategory } from '@/features/categories/api'
import { categoryQueryKeys } from './use-sections'

export function useDeleteCategory() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => deleteCategory(id),
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: categoryQueryKeys.sectionsWithCategories(),
                }),
                queryClient.invalidateQueries({ queryKey: categoryQueryKeys.all }),
            ])
        },
    })
}
