import { apiClient } from '@/lib/api-client'
import type {
    Transaction,
    TransactionsMeta,
    GetTransactionsParams,
    CreateTransactionPayload,
    UpdateTransactionPayload,
} from '@/features/transactions/types/transaction.types'

const buildQuery = (params?: GetTransactionsParams) => {
    if (!params) return ''
    const qs = new URLSearchParams()
    if (params.type) qs.set('type', params.type)
    if (params.accountId) qs.set('accountId', params.accountId)
    if (params.categoryId) qs.set('categoryId', params.categoryId)
    if (params.fromAccountId) qs.set('fromAccountId', params.fromAccountId)
    if (params.toAccountId) qs.set('toAccountId', params.toAccountId)
    if (params.month) qs.set('month', params.month)
    if (params.startDate) qs.set('startDate', params.startDate)
    if (params.endDate) qs.set('endDate', params.endDate)
    if (params.search) qs.set('search', params.search)
    if (typeof params.includeArchived === 'boolean')
        qs.set('includeArchived', String(params.includeArchived))
    if (typeof params.page === 'number') qs.set('page', String(params.page))
    if (typeof params.pageSize === 'number') qs.set('pageSize', String(params.pageSize))
    const s = qs.toString()
    return s ? `?${s}` : ''
}

export const getTransactions = async (
    params?: GetTransactionsParams,
): Promise<{ data: Transaction[]; meta?: TransactionsMeta }> => {
    const response = await apiClient<{ data: Transaction[]; meta?: TransactionsMeta }>(
        `/api/v1/transactions${buildQuery(params)}`,
    )
    return response
}

export const getTransaction = async (id: string): Promise<Transaction> => {
    const response = await apiClient<{ data: Transaction }>(`/api/v1/transactions/${id}`)
    return response.data
}

export const createTransaction = async (input: CreateTransactionPayload): Promise<Transaction> => {
    const response = await apiClient<{ data: Transaction }>(`/api/v1/transactions`, {
        method: 'POST',
        body: input,
    })
    return response.data
}

export const updateTransaction = async (
    id: string,
    input: UpdateTransactionPayload,
): Promise<Transaction> => {
    const response = await apiClient<{ data: Transaction }>(`/api/v1/transactions/${id}`, {
        method: 'PATCH',
        body: input,
    })
    return response.data
}

export const deleteTransaction = async (id: string): Promise<void> => {
    await apiClient<{ data: unknown }>(`/api/v1/transactions/${id}`, {
        method: 'DELETE',
    })
}
