import { useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import { TextField } from '@/components/form/TextField'
import { PasswordField } from '@/components/form/PasswordField'
import { FormError } from '@/components/form/FormError'
import { FormSubmitButton } from '@/components/form/FormSubmitButton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useSignup } from '@/features/auth/hooks'
import { signupSchema, type SignupInput } from '@/features/auth/schemas'

export const SignupForm = () => {
    const { signup, isPending, isSuccess } = useSignup()
    const successRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (isSuccess) successRef.current?.focus()
    }, [isSuccess])

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<SignupInput>({ resolver: zodResolver(signupSchema) })

    const onSubmit = async (data: SignupInput) => {
        try {
            await signup({ email: data.email, password: data.password })
        } catch (err) {
            if (err instanceof Error) setError('root', { message: err.message })
        }
    }

    if (isSuccess) {
        return (
            <Alert ref={successRef} role="status" tabIndex={-1} variant="success">
                <CheckCircle className="h-4 w-4" aria-hidden="true" />
                <AlertDescription>
                    Account created! Please check your email to verify your account.
                </AlertDescription>
            </Alert>
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
            <PasswordField
                id="password"
                label="Password"
                autoComplete="new-password"
                error={errors.password?.message}
                required
                {...register('password')}
            />
            <PasswordField
                id="confirmPassword"
                label="Confirm Password"
                autoComplete="new-password"
                error={errors.confirmPassword?.message}
                required
                {...register('confirmPassword')}
            />
            <FormSubmitButton isLoading={isPending} loadingText="Creating account...">
                Create account
            </FormSubmitButton>
            <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-primary underline-offset-4 hover:underline">
                    Sign in
                </Link>
            </p>
        </form>
    )
}
