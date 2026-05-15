import { useMutation } from '@tanstack/react-query'
import { authService } from '@/features/auth/services'
import { toast } from '@/components/ui/use-toast'

export function useForgotPassword() {
    const { mutateAsync, isPending, isSuccess, error } = useMutation({
        mutationFn: (email: string) => authService.forgotPassword(email),
        onSuccess: () => {
            toast({ title: 'Reset link sent', description: 'Check your email for the reset link.' })
        },
        onError: (error: Error) => {
            toast({
                variant: 'destructive',
                title: 'Failed to send reset link',
                description: error.message,
            })
        },
    })
    return { forgotPassword: mutateAsync, isPending, isSuccess, error }
}
