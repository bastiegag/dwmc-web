import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createCategory } from '@/features/categories/api'
import type { CreateCategoryInput } from '@/features/categories/types'
import { categoryQueryKeys } from './use-sections'

export function useCreateCategory() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (input: CreateCategoryInput) => createCategory(input),
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
