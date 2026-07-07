import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteTransaction } from '@/features/transactions/api/transactions.api'
import { transactionQueryKeys } from './use-transactions'
import { accountQueryKeys } from '@/features/accounts/hooks/use-accounts'

export const useDeleteTransaction = () => {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: (id: string) => deleteTransaction(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: transactionQueryKeys.lists() })
            queryClient.invalidateQueries({ queryKey: accountQueryKeys.lists() })
        },
    })

    return mutation
}
