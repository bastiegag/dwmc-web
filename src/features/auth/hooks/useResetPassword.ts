import { useEffect, useRef } from 'react'
import { useMutation } from '@tanstack/react-query'
import { authService } from '@/features/auth/services'
import { toast } from '@/components/ui/use-toast'

export function useResetPassword() {
    const abortRef = useRef<AbortController | null>(null)

    useEffect(() => {
        const controller = new AbortController()
        abortRef.current = controller
        return () => controller.abort()
    }, [])

    const { mutateAsync, isPending, isSuccess, error } = useMutation({
        mutationFn: (password: string) =>
            authService.resetPassword(password, abortRef.current?.signal),
        onSuccess: () => {
            toast({ title: 'Password updated', description: 'Your password has been reset.' })
        },
        onError: (error: Error) => {
            if (error.name === 'AbortError') return
            toast({
                variant: 'destructive',
                title: 'Failed to reset password',
                description: error.message,
            })
        },
    })
    return { resetPassword: mutateAsync, isPending, isSuccess, error }
}
