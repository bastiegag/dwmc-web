import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTransaction } from '@/features/transactions/api/transactions.api'
import type { CreateTransactionPayload } from '@/features/transactions/types/transaction.types'
import { transactionQueryKeys } from './use-transactions'
import { accountQueryKeys } from '@/features/accounts/hooks/use-accounts'

export const useCreateTransaction = () => {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: (input: CreateTransactionPayload) => createTransaction(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: transactionQueryKeys.lists() })
            queryClient.invalidateQueries({ queryKey: accountQueryKeys.lists() })
        },
    })

    return mutation
}
