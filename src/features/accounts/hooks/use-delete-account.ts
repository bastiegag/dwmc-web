import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteAccount } from '@/features/accounts/api/accounts.api'
import { accountQueryKeys } from './use-accounts'

export function useDeleteAccount() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => deleteAccount(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: accountQueryKeys.lists() })
        },
    })
}
