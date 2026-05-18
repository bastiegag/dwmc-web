import { useEffect, useRef } from 'react'
import { useMutation } from '@tanstack/react-query'
import { authService } from '@/features/auth/services'
import { toast } from '@/components/ui/use-toast'

export function useForgotPassword() {
    const abortRef = useRef<AbortController | null>(null)

    useEffect(() => {
        const controller = new AbortController()
        abortRef.current = controller
        return () => controller.abort()
    }, [])

    const { mutateAsync, isPending, isSuccess, error } = useMutation({
        mutationFn: (email: string) => authService.forgotPassword(email, abortRef.current?.signal),
        onSuccess: () => {
            toast({ title: 'Reset link sent', description: 'Check your email for the reset link.' })
        },
        onError: (error: Error) => {
            if (error.name === 'AbortError') return
            toast({
                variant: 'destructive',
                title: 'Failed to send reset link',
                description: error.message,
            })
        },
    })
    return { forgotPassword: mutateAsync, isPending, isSuccess, error }
}
