import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createSection } from '@/features/categories/api'
import type { CreateSectionInput } from '@/features/categories/types'
import { categoryQueryKeys, sectionQueryKeys } from './use-sections'
import { dashboardQueryKeys } from '@/features/dashboard'

export const useCreateSection = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (input: CreateSectionInput) => createSection(input),
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: categoryQueryKeys.lists() }),
                queryClient.invalidateQueries({ queryKey: sectionQueryKeys.lists() }),
                queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.lists() }),
            ])
        },
    })
}
