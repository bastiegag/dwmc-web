import { useQuery } from '@tanstack/react-query'
import { getTransaction } from '@/features/transactions/api/transactions.api'

import { transactionQueryKeys } from './use-transactions'

export const useTransaction = (id: string) => {
    return useQuery({
        queryKey: transactionQueryKeys.detail(id),
        queryFn: () => getTransaction(id),
        enabled: !!id,
    })
}
