import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateAccount } from '@/features/accounts/api/accounts.api'
import { accountQueryKeys } from './use-accounts'
import type { UpdateAccountPayload } from '@/features/accounts/types/account.types'
import { dashboardQueryKeys } from '@/features/dashboard'

export const useUpdateAccount = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: UpdateAccountPayload }) =>
            updateAccount(id, input),
        onSuccess: async (_data, variables) => {
            await queryClient.invalidateQueries({ queryKey: accountQueryKeys.lists() })
            if (variables && 'id' in variables && variables.id) {
                await queryClient.invalidateQueries({
                    queryKey: accountQueryKeys.detail(variables.id),
                })
            }
            await queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.lists() })
        },
    })
}
