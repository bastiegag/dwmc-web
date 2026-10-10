import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextField, FormError } from '@/components/form'
import { Alert, AppLink, Button } from '@/components/ui'
import { useForgotPassword } from '@/features/auth/hooks'
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/features/auth/schemas'

export const ForgotPasswordForm = () => {
    const { forgotPassword, isPending, isSuccess } = useForgotPassword()
    const successRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        successRef.current?.focus()
    }, [isSuccess])

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<ForgotPasswordInput>({
        resolver: zodResolver(forgotPasswordSchema),
        shouldFocusError: true,
    })

    const onSubmit = async (data: ForgotPasswordInput) => {
        try {
            await forgotPassword(data.email)
        } catch (err) {
            if (err instanceof Error) setError('root', { message: err.message })
        }
    }

    if (isSuccess) {
        return (
            <div className="space-y-4">
                <Alert
                    ref={successRef}
                    tabIndex={-1}
                    role="status"
                    variant="success"
                    description="Password reset link sent! Check your email inbox."
                />
                <p className="text-center text-sm">
                    <AppLink to="/login">Back to sign in</AppLink>
                </p>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <FormError message={errors.root?.message} />
            <TextField
                id="email"
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                required
                {...register('email')}
            />
            <Button
                type="submit"
                className="w-full"
                isLoading={isPending}
                loadingText="Sending reset link..."
            >
                Send reset link
            </Button>
            <p className="text-center text-sm">
                Remember your password? <AppLink to="/login">Sign in</AppLink>
            </p>
        </form>
    )
}
