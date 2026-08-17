import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTransaction } from '@/features/transactions/api/transactions.api'
import type { UpdateTransactionPayload } from '@/features/transactions/types/transaction.types'
import { transactionQueryKeys } from './use-transactions'
import { accountQueryKeys } from '@/features/accounts/hooks/use-accounts'
import { budgetQueryKeys } from '@/features/budgets/hooks/use-budgets'
import { dashboardQueryKeys } from '@/features/dashboard'

export const useUpdateTransaction = () => {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: ({ id, input }: { id: string; input: UpdateTransactionPayload }) =>
            updateTransaction(id, input),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: transactionQueryKeys.lists() })
            queryClient.invalidateQueries({ queryKey: transactionQueryKeys.detail(variables.id) })
            queryClient.invalidateQueries({ queryKey: accountQueryKeys.lists() })
            queryClient.invalidateQueries({ queryKey: budgetQueryKeys.lists() })
            queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.lists() })
        },
    })

    return mutation
}
