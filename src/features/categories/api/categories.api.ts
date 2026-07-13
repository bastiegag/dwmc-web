import { apiClient } from '@/lib/api-client'
import type {
    Category,
    CreateCategoryInput,
    UpdateCategoryInput,
} from '@/features/categories/types'

export const getCategories = async (): Promise<Category[]> => {
    const response = await apiClient<{ data: Category[] }>('/categories')

    return response.data
}

export const createCategory = async (input: CreateCategoryInput): Promise<Category> => {
    const response = await apiClient<{ data: Category }>('/categories', {
        method: 'POST',
        body: input,
    })

    return response.data
}

export const updateCategory = async (id: string, input: UpdateCategoryInput): Promise<Category> => {
    const response = await apiClient<{ data: Category }>(`/categories/${id}`, {
        method: 'PATCH',
        body: input,
    })

    return response.data
}

export const deleteCategory = async (id: string): Promise<void> => {
    await apiClient<{ data: Category }>(`/categories/${id}`, {
        method: 'DELETE',
    })
}
