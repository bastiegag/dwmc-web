import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAccount } from '@/features/accounts/api/accounts.api'
import { accountQueryKeys } from './use-accounts'
import type { CreateAccountPayload } from '@/features/accounts/types/account.types'

export const useCreateAccount = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (input: CreateAccountPayload) => createAccount(input),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: accountQueryKeys.lists() })
        },
    })
}
