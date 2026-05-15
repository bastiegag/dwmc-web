import { useMutation } from '@tanstack/react-query'
import { authService } from '@/features/auth/services'
import { toast } from '@/components/ui/use-toast'
import type { LoginCredentials } from '@/features/auth/types'

export function useLogin() {
    const { mutateAsync, isPending, error } = useMutation({
        mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
        onError: (error: Error) => {
            toast({ variant: 'destructive', title: 'Sign in failed', description: error.message })
        },
    })
    return { login: mutateAsync, isPending, error }
}
