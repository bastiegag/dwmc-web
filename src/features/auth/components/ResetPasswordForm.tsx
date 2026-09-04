import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import { PasswordField, FormError, FormSubmitButton } from '@/components/form'
import { Alert, AlertDescription } from '@/components/ui'
import { useResetPassword } from '@/features/auth/hooks'
import { resetPasswordSchema, type ResetPasswordInput } from '@/features/auth/schemas'

export const ResetPasswordForm = () => {
    const { resetPassword, isPending, isSuccess } = useResetPassword()
    const successRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (isSuccess) successRef.current?.focus()
    }, [isSuccess])

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<ResetPasswordInput>({
        resolver: zodResolver(resetPasswordSchema),
        shouldFocusError: true,
    })

    const onSubmit = async (data: ResetPasswordInput) => {
        try {
            await resetPassword(data.password)
        } catch (err) {
            if (err instanceof Error) setError('root', { message: err.message })
        }
    }

    if (isSuccess) {
        return (
            <div className="space-y-4">
                <Alert ref={successRef} role="status" tabIndex={-1} variant="success">
                    <CheckCircle className="h-4 w-4" aria-hidden="true" />
                    <AlertDescription>Password updated successfully!</AlertDescription>
                </Alert>
                <p className="text-center text-sm">
                    <Link to="/login" className="text-primary underline-offset-4 hover:underline">
                        Sign in with your new password
                    </Link>
                </p>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <FormError message={errors.root?.message} />
            <PasswordField
                id="password"
                label="New Password"
                autoComplete="new-password"
                error={errors.password?.message}
                required
                {...register('password')}
            />
            <PasswordField
                id="confirmPassword"
                label="Confirm New Password"
                autoComplete="new-password"
                error={errors.confirmPassword?.message}
                required
                {...register('confirmPassword')}
            />
            <FormSubmitButton isLoading={isPending} loadingText="Updating password...">
                Update password
            </FormSubmitButton>
        </form>
    )
}
