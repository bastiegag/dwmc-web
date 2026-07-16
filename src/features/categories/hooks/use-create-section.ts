import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createSection } from '@/features/categories/api'
import type { CreateSectionInput } from '@/features/categories/types'
import { sectionQueryKeys } from './use-sections'

export const useCreateSection = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (input: CreateSectionInput) => createSection(input),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: sectionQueryKeys.lists(),
            })
        },
    })
}
