import { useMutation } from '@tanstack/react-query'
import { authService } from '@/features/auth/services'
import { toast } from 'sonner'

export function useForgotPassword() {
    const { mutateAsync, isPending, isSuccess, error } = useMutation({
        mutationFn: (email: string) => authService.forgotPassword(email),
        onSuccess: () => {
            toast.success('Reset link sent', {
                description: 'Check your email for the reset link.',
            })
        },
        onError: (error: Error) => {
            toast.error('Failed to send reset link', { description: error.message })
        },
    })
    return { forgotPassword: mutateAsync, isPending, isSuccess, error }
}
