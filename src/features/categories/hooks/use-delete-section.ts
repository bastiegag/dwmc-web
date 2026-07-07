import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteSection } from '@/features/categories/api'
import { categoryQueryKeys } from './use-sections'

export const useDeleteSection = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => deleteSection(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: categoryQueryKeys.sectionsWithCategories(),
            })
        },
    })
}
