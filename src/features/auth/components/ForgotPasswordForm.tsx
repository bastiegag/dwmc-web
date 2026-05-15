import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import { TextField } from '@/components/form/TextField'
import { FormError } from '@/components/form/FormError'
import { FormSubmitButton } from '@/components/form/FormSubmitButton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useForgotPassword } from '@/features/auth/hooks'
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/features/auth/schemas'

export function ForgotPasswordForm() {
    const { forgotPassword, isPending, isSuccess } = useForgotPassword()

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema) })

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
                <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                    <CheckCircle
                        className="h-4 w-4 text-green-600 dark:text-green-400"
                        aria-hidden="true"
                    />
                    <AlertDescription className="text-green-800 dark:text-green-200">
                        Password reset link sent! Check your email inbox.
                    </AlertDescription>
                </Alert>
                <p className="text-center text-sm text-muted-foreground">
                    <Link to="/login" className="text-primary underline-offset-4 hover:underline">
                        Back to sign in
                    </Link>
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
                Remember your password?{' '}
                <Link to="/login" className="text-primary underline-offset-4 hover:underline">
                    Sign in
                </Link>
            </p>
        </form>
    )
}
