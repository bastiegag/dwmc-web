import { useQuery } from '@tanstack/react-query'
import { getTransactions } from '@/features/transactions/api/transactions.api'
import type { GetTransactionsParams } from '@/features/transactions/types/transaction.types'

export const transactionQueryKeys = {
    all: ['transactions'] as const,
    lists: () => [...transactionQueryKeys.all, 'list'] as const,
    list: (filters?: GetTransactionsParams) =>
        [...transactionQueryKeys.lists(), filters ?? {}] as const,
    detail: (id: string) => [...transactionQueryKeys.all, 'detail', id] as const,
}

export const useTransactions = (params?: GetTransactionsParams) => {
    return useQuery({
        queryKey: transactionQueryKeys.list(params),
        queryFn: () => getTransactions(params),
    })
}
