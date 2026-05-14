import { useMutation } from '@tanstack/react-query'
import { authService } from '@/features/auth/services'
import { toast } from '@/components/ui/use-toast'

export function useResetPassword() {
  const { mutateAsync, isPending, isSuccess, error } = useMutation({
    mutationFn: (password: string) => authService.resetPassword(password),
    onSuccess: () => {
      toast({ title: 'Password updated', description: 'Your password has been reset.' })
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Failed to reset password',
        description: error.message,
      })
    },
  })
  return { resetPassword: mutateAsync, isPending, isSuccess, error }
}
