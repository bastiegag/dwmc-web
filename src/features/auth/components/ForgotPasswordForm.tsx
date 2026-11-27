import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextField, FormError } from '@/components/form'
import { AppLink, Button } from '@/components/ui'
import { useForgotPassword } from '@/features/auth/hooks'
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/features/auth/schemas'

export const ForgotPasswordForm = () => {
    const { forgotPassword, isPending } = useForgotPassword()
    const navigate = useNavigate()

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
            navigate('/login', { replace: true })
        } catch (err) {
            if (err instanceof Error) setError('root', { message: err.message })
        }
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
                color="primary"
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
