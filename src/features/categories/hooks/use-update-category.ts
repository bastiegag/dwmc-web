import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateCategory } from '@/features/categories/api'
import type { UpdateCategoryInput } from '@/features/categories/types'
import { categoryQueryKeys } from './use-sections'

export function useUpdateCategory() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: UpdateCategoryInput }) =>
            updateCategory(id, input),
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
