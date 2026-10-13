import { useMutation } from '@tanstack/react-query'
import { authService } from '@/features/auth/services'
import { toast } from 'sonner'

export const useResetPassword = () => {
    const { mutateAsync, isPending, isSuccess, error } = useMutation({
        mutationFn: (password: string) => authService.resetPassword(password),
        onSuccess: () => {
            toast.success('Password updated', { description: 'Your password has been reset.' })
        },
    })
    return { resetPassword: mutateAsync, isPending, isSuccess, error }
}
