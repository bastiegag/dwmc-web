import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateSection } from '@/features/categories/api'
import type { UpdateSectionInput } from '@/features/categories/types'
import { categoryQueryKeys } from './use-sections'

export const useUpdateSection = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: UpdateSectionInput }) =>
            updateSection(id, input),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: categoryQueryKeys.sectionsWithCategories(),
            })
        },
    })
}
