import { apiClient } from '@/lib/api-client'
import type {
    Budget,
    CreateBudgetPayload,
    GetBudgetsParams,
    UpdateBudgetPayload,
} from '@/features/budgets/types/budget.types'

function buildQuery(params?: GetBudgetsParams) {
    if (!params) return ''
    const qs = new URLSearchParams()
    if (params.month) qs.set('month', params.month)
    if (params.categoryId) qs.set('categoryId', params.categoryId)
    if (typeof params.includeArchived === 'boolean')
        qs.set('includeArchived', String(params.includeArchived))
    const s = qs.toString()
    return s ? `?${s}` : ''
}

export async function getBudgets(params?: GetBudgetsParams): Promise<Budget[]> {
    const response = await apiClient<{ data: Budget[] }>(`/api/v1/budgets${buildQuery(params)}`)
    return response.data
}

export async function getBudget(id: string): Promise<Budget> {
    const response = await apiClient<{ data: Budget }>(`/api/v1/budgets/${id}`)
    return response.data
}

export async function createBudget(input: CreateBudgetPayload): Promise<Budget> {
    const response = await apiClient<{ data: Budget }>(`/api/v1/budgets`, {
        method: 'POST',
        body: input,
    })
    return response.data
}

export async function updateBudget(id: string, input: UpdateBudgetPayload): Promise<Budget> {
    const response = await apiClient<{ data: Budget }>(`/api/v1/budgets/${id}`, {
        method: 'PATCH',
        body: input,
    })
    return response.data
}

export async function deleteBudget(id: string): Promise<void> {
    await apiClient<{ data: unknown }>(`/api/v1/budgets/${id}`, {
        method: 'DELETE',
    })
}
