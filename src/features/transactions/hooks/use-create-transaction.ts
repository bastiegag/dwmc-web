import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTransaction } from '@/features/transactions/api/transactions.api'
import type { CreateTransactionPayload } from '@/features/transactions/types/transaction.types'
import { transactionQueryKeys } from './use-transactions'
import { accountQueryKeys } from '@/features/accounts/hooks/use-accounts'
import { budgetQueryKeys } from '@/features/budgets/hooks/use-budgets'
import { dashboardQueryKeys } from '@/features/dashboard'

export const useCreateTransaction = () => {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: (input: CreateTransactionPayload) => createTransaction(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: transactionQueryKeys.lists() })
            queryClient.invalidateQueries({ queryKey: accountQueryKeys.lists() })
            queryClient.invalidateQueries({ queryKey: budgetQueryKeys.lists() })
            queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.lists() })
        },
    })

    return mutation
}
