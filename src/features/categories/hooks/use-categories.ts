import { useQuery } from '@tanstack/react-query'
import { getCategories } from '@/features/categories/api'
import { categoryQueryKeys } from './use-sections'

export function useCategories() {
    return useQuery({
        queryKey: categoryQueryKeys.all,
        queryFn: getCategories,
    })
}
