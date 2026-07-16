import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createCategory } from '@/features/categories/api'
import type { CreateCategoryInput } from '@/features/categories/types'
import { categoryQueryKeys, sectionQueryKeys } from './use-sections'

export const useCreateCategory = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (input: CreateCategoryInput) => createCategory(input),
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: categoryQueryKeys.lists() }),
                queryClient.invalidateQueries({ queryKey: sectionQueryKeys.lists() }),
            ])
        },
    })
}
