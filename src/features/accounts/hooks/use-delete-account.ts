import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteAccount } from '@/features/accounts/api/accounts.api'
import { accountQueryKeys } from './use-accounts'
import { dashboardQueryKeys } from '@/features/dashboard'

export const useDeleteAccount = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => deleteAccount(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: accountQueryKeys.lists() })
            await queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.lists() })
        },
    })
}
