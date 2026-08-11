import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteSection } from '@/features/categories/api'
import { categoryQueryKeys, sectionQueryKeys } from './use-sections'
import { dashboardQueryKeys } from '@/features/dashboard'

export const useDeleteSection = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => deleteSection(id),
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: categoryQueryKeys.lists() }),
                queryClient.invalidateQueries({ queryKey: sectionQueryKeys.lists() }),
                queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.lists() }),
            ])
        },
    })
}
