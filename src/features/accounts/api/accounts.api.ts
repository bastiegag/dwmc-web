import { apiClient } from '@/lib/api-client'
import type {
    Account,
    CreateAccountPayload,
    UpdateAccountPayload,
    GetAccountsParams,
} from '@/features/accounts/types/account.types'

const buildQuery = (params?: GetAccountsParams) => {
    if (!params) return ''
    const qs = new URLSearchParams()
    if (params.type) qs.set('type', params.type)
    if (params.includeArchived) qs.set('includeArchived', String(params.includeArchived))
    const s = qs.toString()
    return s ? `?${s}` : ''
}

export const getAccounts = async (params?: GetAccountsParams): Promise<Account[]> => {
    const response = await apiClient<{ data: Account[] }>(`/accounts${buildQuery(params)}`)
    return response.data
}

export const getAccount = async (id: string): Promise<Account> => {
    const response = await apiClient<{ data: Account }>(`/accounts/${id}`)
    return response.data
}

export const createAccount = async (input: CreateAccountPayload): Promise<Account> => {
    const response = await apiClient<{ data: Account }>('/accounts', {
        method: 'POST',
        body: input,
    })
    return response.data
}

export const updateAccount = async (id: string, input: UpdateAccountPayload): Promise<Account> => {
    const response = await apiClient<{ data: Account }>(`/accounts/${id}`, {
        method: 'PATCH',
        body: input,
    })
    return response.data
}

export const deleteAccount = async (id: string): Promise<void> => {
    await apiClient<{ data: Account }>(`/accounts/${id}`, {
        method: 'DELETE',
    })
}
