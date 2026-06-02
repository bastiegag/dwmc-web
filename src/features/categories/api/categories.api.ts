import { apiClient } from '@/lib/api-client'
import type {
    Category,
    CreateCategoryInput,
    UpdateCategoryInput,
} from '@/features/categories/types'

export async function getCategories(): Promise<Category[]> {
    const response = await apiClient<{ data: Category[] }>('/api/v1/categories')

    return response.data
}

export async function createCategory(input: CreateCategoryInput): Promise<Category> {
    const response = await apiClient<{ data: Category }>('/api/v1/categories', {
        method: 'POST',
        body: input,
    })

    return response.data
}

export async function updateCategory(id: string, input: UpdateCategoryInput): Promise<Category> {
    const response = await apiClient<{ data: Category }>(`/api/v1/categories/${id}`, {
        method: 'PATCH',
        body: input,
    })

    return response.data
}

export async function deleteCategory(id: string): Promise<void> {
    await apiClient<{ data: Category }>(`/api/v1/categories/${id}`, {
        method: 'DELETE',
    })
}
