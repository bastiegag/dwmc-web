import { useQuery } from '@tanstack/react-query'
import { getCategories } from '@/features/categories/api'
import { categoryQueryKeys } from './use-sections'

export const useCategories = () => {
    return useQuery({
        queryKey: categoryQueryKeys.list(),
        queryFn: () => getCategories(),
    })
}
