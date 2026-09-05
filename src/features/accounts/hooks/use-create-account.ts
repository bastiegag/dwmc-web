import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAccount } from '@/features/accounts/api/accounts.api'
import { accountQueryKeys } from './use-accounts'
import type { CreateAccountPayload } from '@/features/accounts/types/account.types'
import { dashboardQueryKeys } from '@/features/dashboard'

export const useCreateAccount = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (input: CreateAccountPayload) => createAccount(input),
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: accountQueryKeys.lists() }),
                queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.lists() }),
            ])
        },
    })
}
