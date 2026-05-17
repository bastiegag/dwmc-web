import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authService } from '@/features/auth/services'
import { toast } from '@/components/ui/use-toast'

export function useLogout() {
    const queryClient = useQueryClient()
    const { mutateAsync, isPending } = useMutation({
        mutationFn: () => authService.logout(),
        onSuccess: () => {
            queryClient.clear()
            toast({ title: 'Signed out', description: 'You have been signed out.' })
        },
        onError: (error: Error) => {
            toast({ variant: 'destructive', title: 'Sign out failed', description: error.message })
        },
    })
    return { logout: mutateAsync, isPending }
}
