import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authService } from '@/features/auth/services'
import { authSessionQueryKey } from '@/features/auth/hooks'
import { toast } from 'sonner'

export const useLogout = () => {
    const queryClient = useQueryClient()
    const { mutateAsync, isPending } = useMutation({
        mutationFn: () => authService.logout(),
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: authSessionQueryKey })
            toast.success('Signed out', { description: 'You have been signed out.' })
        },
        onError: (error: Error) => {
            toast.error('Sign out failed', { description: error.message })
        },
    })
    return { logout: mutateAsync, isPending }
}
