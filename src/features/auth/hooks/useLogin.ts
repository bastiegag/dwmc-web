import { useMutation } from '@tanstack/react-query'
import { authService } from '@/features/auth/services'
import type { LoginCredentials } from '@/features/auth/types'

export function useLogin() {
    const { mutateAsync, isPending, error } = useMutation({
        mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    })
    return { login: mutateAsync, isPending, error }
}
