import { apiClient } from '@/lib/api-client'
import type {
    Account,
    CreateAccountPayload,
    UpdateAccountPayload,
    GetAccountsParams,
} from '@/features/accounts/types/account.types'

function buildQuery(params?: GetAccountsParams) {
    if (!params) return ''
    const qs = new URLSearchParams()
    if (params.type) qs.set('type', params.type)
    if (params.includeArchived) qs.set('includeArchived', String(params.includeArchived))
    const s = qs.toString()
    return s ? `?${s}` : ''
}

export async function getAccounts(params?: GetAccountsParams): Promise<Account[]> {
    const response = await apiClient<{ data: Account[] }>(`/api/v1/accounts${buildQuery(params)}`)
    return response.data
}

export async function getAccount(id: string): Promise<Account> {
    const response = await apiClient<{ data: Account }>(`/api/v1/accounts/${id}`)
    return response.data
}

export async function createAccount(input: CreateAccountPayload): Promise<Account> {
    const response = await apiClient<{ data: Account }>('/api/v1/accounts', {
        method: 'POST',
        body: input,
    })
    return response.data
}

export async function updateAccount(id: string, input: UpdateAccountPayload): Promise<Account> {
    const response = await apiClient<{ data: Account }>(`/api/v1/accounts/${id}`, {
        method: 'PATCH',
        body: input,
    })
    return response.data
}

export async function deleteAccount(id: string): Promise<void> {
    await apiClient<{ data: Account }>(`/api/v1/accounts/${id}`, {
        method: 'DELETE',
    })
}
