import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authService } from '@/features/auth/services'
import { toast } from 'sonner'

export function useLogout() {
    const queryClient = useQueryClient()
    const { mutateAsync, isPending } = useMutation({
        mutationFn: () => authService.logout(),
        onSuccess: () => {
            queryClient.clear()
            toast.success('Signed out', { description: 'You have been signed out.' })
        },
        onError: (error: Error) => {
            toast.error('Sign out failed', { description: error.message })
        },
    })
    return { logout: mutateAsync, isPending }
}
