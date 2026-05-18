import { useEffect, useRef } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authService } from '@/features/auth/services'
import { toast } from '@/components/ui/use-toast'

export function useLogout() {
    const queryClient = useQueryClient()
    const abortRef = useRef<AbortController | null>(null)

    useEffect(() => {
        const controller = new AbortController()
        abortRef.current = controller
        return () => controller.abort()
    }, [])

    const { mutateAsync, isPending } = useMutation({
        mutationFn: () => authService.logout(abortRef.current?.signal),
        onSuccess: () => {
            queryClient.clear()
            toast({ title: 'Signed out', description: 'You have been signed out.' })
        },
        onError: (error: Error) => {
            if (error.name === 'AbortError') return
            toast({ variant: 'destructive', title: 'Sign out failed', description: error.message })
        },
    })
    return { logout: mutateAsync, isPending }
}
