import { apiClient } from '@/lib/api-client'
import type {
    CreateSectionInput,
    Section,
    SectionWithCategories,
    UpdateSectionInput,
} from '@/features/categories/types'

export async function getSections(): Promise<SectionWithCategories[]> {
    const response = await apiClient<{ data: SectionWithCategories[] }>(
        '/api/v1/sections?includeCategories=true',
    )

    return response.data
}

export async function createSection(input: CreateSectionInput): Promise<Section> {
    const response = await apiClient<{ data: Section }>('/api/v1/sections', {
        method: 'POST',
        body: input,
    })

    return response.data
}

export async function updateSection(id: string, input: UpdateSectionInput): Promise<Section> {
    const response = await apiClient<{ data: Section }>(`/api/v1/sections/${id}`, {
        method: 'PATCH',
        body: input,
    })

    return response.data
}

export async function deleteSection(id: string): Promise<void> {
    await apiClient<{ data: Section }>(`/api/v1/sections/${id}`, {
        method: 'DELETE',
    })
}
