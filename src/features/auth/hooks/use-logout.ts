import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authService } from '@/features/auth/services'
import { authSessionQueryKey } from './use-auth'
import { toast } from 'sonner'

export const useLogout = () => {
    const queryClient = useQueryClient()
    const { mutateAsync, isPending } = useMutation({
        mutationFn: () => authService.logout(),
        onSuccess: () => {
            queryClient.removeQueries({
                predicate: (query) => query.queryKey[0] !== authSessionQueryKey[0],
            })
            toast.success('Signed out', { description: 'You have been signed out.' })
        },
        onError: (error: Error) => {
            toast.error('Sign out failed', { description: error.message })
        },
    })
    return { logout: mutateAsync, isPending }
}
