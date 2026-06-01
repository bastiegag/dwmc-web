import { useQuery } from '@tanstack/react-query'
import { getSections } from '@/features/categories/api'

export const categoryQueryKeys = {
    all: ['categories'] as const,
    sections: () => [...categoryQueryKeys.all, 'sections'] as const,
    sectionsWithCategories: () =>
        [...categoryQueryKeys.sections(), { includeCategories: true }] as const,
}

export function useSections() {
    return useQuery({
        queryKey: categoryQueryKeys.sectionsWithCategories(),
        queryFn: getSections,
    })
}
