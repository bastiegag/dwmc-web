import { apiClient } from '@/lib/api-client'
import type { UpdateProfilePayload, UserProfile } from '../types/profile.types'

export const getProfile = async (): Promise<UserProfile> => {
    const response = await apiClient<{ data: UserProfile }>('/profile')
    return response.data
}

export const updateProfile = async (input: UpdateProfilePayload): Promise<UserProfile> => {
    const response = await apiClient<{ data: UserProfile }>('/profile', {
        method: 'PATCH',
        body: input,
    })
    return response.data
}
