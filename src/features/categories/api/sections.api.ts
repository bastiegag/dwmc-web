import { apiClient } from '@/lib/api-client'
import type {
    CreateSectionInput,
    Section,
    SectionWithCategories,
    UpdateSectionInput,
} from '@/features/categories/types'
import { fetchAllCursorPages } from './cursor-pagination'

export const getSections = async (options: { includeArchived?: boolean } = {}) => {
    return fetchAllCursorPages<SectionWithCategories>('/sections', {
        includeCategories: 'true',
        ...(options.includeArchived ? { includeArchived: 'true' } : {}),
    })
}

export const createSection = async (input: CreateSectionInput): Promise<Section> => {
    const response = await apiClient<{ data: Section }>('/sections', {
        method: 'POST',
        body: input,
    })

    return response.data
}

export const updateSection = async (id: string, input: UpdateSectionInput): Promise<Section> => {
    const response = await apiClient<{ data: Section }>(`/sections/${id}`, {
        method: 'PATCH',
        body: input,
    })

    return response.data
}

export const deleteSection = async (id: string): Promise<void> => {
    await apiClient<{ data: Section }>(`/sections/${id}`, {
        method: 'DELETE',
    })
}
