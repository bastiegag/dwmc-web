import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteAccount } from '@/features/accounts/api/accounts.api'
import { accountQueryKeys } from './use-accounts'
import { dashboardQueryKeys } from '@/features/dashboard'

export const useDeleteAccount = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => deleteAccount(id),
        onSuccess: async (_data, id) => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: accountQueryKeys.lists() }),
                queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.lists() }),
                queryClient.invalidateQueries({ queryKey: accountQueryKeys.detail(id) }),
            ])
        },
    })
}
