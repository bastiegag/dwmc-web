import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { TextField, PasswordField, FormError, FormSubmitButton } from '@/components/form'
import { useLogin } from '@/features/auth/hooks'
import { loginSchema, type LoginInput } from '@/features/auth/schemas'

type ReturnLocation = string | { pathname?: string; search?: string; hash?: string }

const getDestination = (state: unknown): string => {
    const from = (state as { from?: ReturnLocation } | null)?.from

    if (typeof from === 'string') return from || '/dashboard'
    if (!from) return '/dashboard'

    return `${from.pathname ?? ''}${from.search ?? ''}${from.hash ?? ''}` || '/dashboard'
}

export const LoginForm = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { login, isPending } = useLogin()
    const destination = getDestination(location.state)

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        shouldFocusError: true,
    })

    const onSubmit = async (data: LoginInput) => {
        try {
            await login(data)
            navigate(destination, { replace: true })
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
                    className="text-sm text-link underline underline-offset-4 hover:underline"
                >
                    Forgot your password?
                </Link>
            </div>
            <FormSubmitButton isLoading={isPending} loadingText="Signing in...">
                Sign in
            </FormSubmitButton>
            <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link
                    to="/signup"
                    className="text-link underline underline-offset-4 hover:underline"
                >
                    Sign up
                </Link>
            </p>
        </form>
    )
}
