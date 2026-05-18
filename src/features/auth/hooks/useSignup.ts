import { useEffect, useRef } from 'react'
import { useMutation } from '@tanstack/react-query'
import { authService } from '@/features/auth/services'
import { toast } from '@/components/ui/use-toast'
import type { SignupCredentials } from '@/features/auth/types'

export function useSignup() {
    const abortRef = useRef<AbortController | null>(null)

    useEffect(() => {
        const controller = new AbortController()
        abortRef.current = controller
        return () => controller.abort()
    }, [])

    const { mutateAsync, isPending, isSuccess, error } = useMutation({
        mutationFn: (credentials: Omit<SignupCredentials, 'confirmPassword'>) =>
            authService.signup(credentials, abortRef.current?.signal),
        onSuccess: () => {
            toast({
                title: 'Account created',
                description: 'Check your email to verify your account.',
            })
        },
    })
    return { signup: mutateAsync, isPending, isSuccess, error }
}
