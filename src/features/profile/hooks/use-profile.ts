import { useQuery } from '@tanstack/react-query'
import { getProfile } from '../api/profile.api'

export const profileQueryKey = ['profile'] as const

export const useProfile = () =>
    useQuery({
        queryKey: profileQueryKey,
        queryFn: getProfile,
    })
