import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { TextField } from '@/components/form/TextField'
import { PasswordField } from '@/components/form/PasswordField'
import { FormError } from '@/components/form/FormError'
import { FormSubmitButton } from '@/components/form/FormSubmitButton'
import { useLogin } from '@/features/auth/hooks'
import { loginSchema, type LoginInput } from '@/features/auth/schemas'

export function LoginForm() {
    const navigate = useNavigate()
    const location = useLocation()
    const { login, isPending, isLockedOut, secondsRemaining } = useLogin()
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/app'

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

    const onSubmit = async (data: LoginInput) => {
        if (isLockedOut) return
        try {
            await login(data)
            navigate(from, { replace: true })
        } catch (err) {
            if (err instanceof Error) setError('root', { message: err.message })
        }
    }

    const errorMessage = isLockedOut
        ? `Too many failed attempts. Try again in ${secondsRemaining}s.`
        : errors.root?.message

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <FormError message={errorMessage} />
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
            <PasswordField
                id="password"
                label="Password"
                autoComplete="current-password"
                error={errors.password?.message}
                required
                {...register('password')}
            />
            <div className="flex justify-end">
                <Link
                    to="/forgot-password"
                    className="text-sm text-primary underline-offset-4 hover:underline"
                >
                    Forgot your password?
                </Link>
            </div>
            <FormSubmitButton
                isLoading={isPending}
                loadingText="Signing in..."
                disabled={isLockedOut}
            >
                Sign in
            </FormSubmitButton>
            <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link to="/signup" className="text-primary underline-offset-4 hover:underline">
                    Sign up
                </Link>
            </p>
        </form>
    )
}
