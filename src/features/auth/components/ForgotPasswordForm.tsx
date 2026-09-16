import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle } from 'lucide-react'
import { TextField, FormError, FormSubmitButton } from '@/components/form'
import { Alert, AlertDescription, AppLink } from '@/components/ui'
import { useForgotPassword } from '@/features/auth/hooks'
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/features/auth/schemas'

export const ForgotPasswordForm = () => {
    const { forgotPassword, isPending, isSuccess } = useForgotPassword()
    const successRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (isSuccess) successRef.current?.focus()
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
                <Alert ref={successRef} tabIndex={-1} role="status" variant="success">
                    <CheckCircle className="h-4 w-4" aria-hidden="true" />
                    <AlertDescription>
                        Password reset link sent! Check your email inbox.
                    </AlertDescription>
                </Alert>
                <p className="text-center text-sm text-muted-foreground">
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
            <FormSubmitButton isLoading={isPending} loadingText="Sending reset link...">
                Send reset link
            </FormSubmitButton>
            <p className="text-center text-sm text-muted-foreground">
                Remember your password? <AppLink to="/login">Sign in</AppLink>
            </p>
        </form>
    )
}
