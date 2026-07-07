import { useQuery } from '@tanstack/react-query'
import { getAccounts } from '@/features/accounts/api/accounts.api'
import type { GetAccountsParams } from '@/features/accounts/types/account.types'

export const accountQueryKeys = {
    all: ['accounts'] as const,
    lists: () => [...accountQueryKeys.all, 'list'] as const,
    list: (filters?: GetAccountsParams) => [...accountQueryKeys.lists(), filters ?? {}] as const,
    detail: (id: string) => [...accountQueryKeys.all, 'detail', id] as const,
}

export const useAccounts = (params?: GetAccountsParams) => {
    return useQuery({
        queryKey: accountQueryKeys.list(params),
        queryFn: () => getAccounts(params),
    })
}
