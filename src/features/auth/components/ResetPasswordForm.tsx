import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PasswordField, FormError } from '@/components/form'
import { Alert, AppLink, Button } from '@/components/ui'
import { useResetPassword } from '@/features/auth/hooks'
import { resetPasswordSchema, type ResetPasswordInput } from '@/features/auth/schemas'

export const ResetPasswordForm = () => {
    const { resetPassword, isPending, isSuccess } = useResetPassword()
    const successRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        successRef.current?.focus()
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
                <Alert
                    ref={successRef}
                    role="status"
                    tabIndex={-1}
                    variant="success"
                    description="Password updated successfully!"
                />
                <p className="text-center text-sm">
                    <AppLink to="/login">Sign in with your new password</AppLink>
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
            <Button
                type="submit"
                className="w-full"
                isLoading={isPending}
                loadingText="Updating password..."
            >
                Update password
            </Button>
        </form>
    )
}
