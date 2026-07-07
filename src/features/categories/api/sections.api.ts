import { apiClient } from '@/lib/api-client'
import type {
    CreateSectionInput,
    Section,
    SectionWithCategories,
    UpdateSectionInput,
} from '@/features/categories/types'

export const getSections = async (): Promise<SectionWithCategories[]> => {
    const response = await apiClient<{ data: SectionWithCategories[] }>(
        '/api/v1/sections?includeCategories=true',
    )

    return response.data
}

export const createSection = async (input: CreateSectionInput): Promise<Section> => {
    const response = await apiClient<{ data: Section }>('/api/v1/sections', {
        method: 'POST',
        body: input,
    })

    return response.data
}

export const updateSection = async (id: string, input: UpdateSectionInput): Promise<Section> => {
    const response = await apiClient<{ data: Section }>(`/api/v1/sections/${id}`, {
        method: 'PATCH',
        body: input,
    })

    return response.data
}

export const deleteSection = async (id: string): Promise<void> => {
    await apiClient<{ data: Section }>(`/api/v1/sections/${id}`, {
        method: 'DELETE',
    })
}
