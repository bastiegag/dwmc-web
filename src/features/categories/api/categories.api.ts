import { apiClient } from '@/lib/api-client'
import type {
    Category,
    CreateCategoryInput,
    UpdateCategoryInput,
} from '@/features/categories/types'
import { fetchAllCursorPages } from './cursor-pagination'

export const getCategories = async (options: { includeArchived?: boolean } = {}) => {
    return fetchAllCursorPages<Category>('/categories', {
        ...(options.includeArchived ? { includeArchived: 'true' } : {}),
    })
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
