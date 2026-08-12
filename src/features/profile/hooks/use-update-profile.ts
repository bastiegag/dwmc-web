import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProfile } from '../api/profile.api'
import { profileQueryKey } from './use-profile'
import type { UpdateProfilePayload } from '../types/profile.types'

export const useUpdateProfile = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (input: UpdateProfilePayload) => updateProfile(input),
        onSuccess: (profile) => {
            queryClient.setQueryData(profileQueryKey, profile)
        },
    })
}
