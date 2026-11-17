import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProfile } from '../api/profile.api'
import { profileQueryKey } from './use-profile'
import type { UpdateProfilePayload } from '../types/profile.types'

export const useUpdateProfile = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (input: UpdateProfilePayload) => updateProfile(input),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: profileQueryKey })
        },
        onSuccess: async (profile) => {
            await queryClient.cancelQueries({ queryKey: profileQueryKey })
            queryClient.setQueryData(profileQueryKey, profile)
        },
    })
}
