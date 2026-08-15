import { useQuery } from '@tanstack/react-query'
import { getSections } from '@/features/categories/api'

type SectionQueryFilters = {
    includeCategories?: boolean
    includeArchived?: boolean
}

export const categoryQueryKeys = {
    all: ['categories'] as const,
    lists: () => [...categoryQueryKeys.all, 'list'] as const,
    list: () => categoryQueryKeys.lists(),
    detail: (id: string) => [...categoryQueryKeys.all, 'detail', id] as const,
}

export const sectionQueryKeys = {
    all: ['sections'] as const,
    lists: () => [...sectionQueryKeys.all, 'list'] as const,
    list: (filters?: SectionQueryFilters) => [...sectionQueryKeys.lists(), filters ?? {}] as const,
    detail: (id: string) => [...sectionQueryKeys.all, 'detail', id] as const,
}

export const useSections = (filters: SectionQueryFilters = {}) => {
    return useQuery({
        queryKey: sectionQueryKeys.list({ includeCategories: true, ...filters }),
        queryFn: () => getSections(filters),
    })
}
