'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, Card } from '@/components/ui'
import { FormError, PasswordField, TextField } from '@/components/form'
import {
    forgotPasswordSchema,
    loginSchema,
    resetPasswordSchema,
    signupSchema,
    type ForgotPasswordInput,
    type LoginInput,
    type ResetPasswordInput,
    type SignupInput,
} from '@/features/auth/schemas'
import { getSupabaseBrowserClient } from '@/lib/supabase/browser'

type AuthFormMode = 'login' | 'signup' | 'forgot' | 'reset'
type AuthFormValues = LoginInput | SignupInput | ForgotPasswordInput | ResetPasswordInput

const authErrorMessage = (error: { code?: string; message?: string }, mode: AuthFormMode) => {
    const text = error.message?.toLowerCase() ?? ''
    if (
        mode === 'login' &&
        (error.code === 'invalid_credentials' || text.includes('invalid login'))
    ) {
        return 'The email or password is incorrect.'
    }
    if (
        mode === 'signup' &&
        (error.code === 'user_already_exists' || text.includes('already registered'))
    ) {
        return 'An account with this email already exists.'
    }
    if (text.includes('rate limit')) return 'Too many attempts. Please wait a moment and try again.'
    if (mode === 'forgot') return 'We could not send a password reset link. Please try again.'
    if (mode === 'reset')
        return 'We could not update your password. Please request a new reset link.'
    return 'Something went wrong. Please try again.'
}

const appUrl = () => {
    const value = process.env.NEXT_PUBLIC_APP_URL
    if (!value) throw new Error('NEXT_PUBLIC_APP_URL is not defined.')
    return value.replace(/\/+$/, '')
}

export function AuthForm({
    mode,
    initialError = false,
}: {
    mode: AuthFormMode
    initialError?: boolean
}) {
    const router = useRouter()
    const [error, setError] = useState<string | null>(
        initialError ? 'The authentication link is invalid or has expired.' : null,
    )
    const [pending, setPending] = useState(false)
    const successRef = useRef<HTMLDivElement>(null)
    const [success, setSuccess] = useState(false)
    const schema =
        mode === 'login'
            ? loginSchema
            : mode === 'signup'
              ? signupSchema
              : mode === 'forgot'
                ? forgotPasswordSchema
                : resetPasswordSchema
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError: setFieldError,
    } = useForm<AuthFormValues>({ resolver: zodResolver(schema), shouldFocusError: true })
    const fieldErrors = errors as Partial<
        Record<'email' | 'password' | 'confirmPassword', { message?: string }>
    >

    useEffect(() => {
        if (success) successRef.current?.focus()
    }, [success])

    const onSubmit = async (values: AuthFormValues) => {
        const parsed = schema.safeParse(values)
        if (!parsed.success) {
            parsed.error.issues.forEach((issue) => {
                const field = issue.path[0]
                if (field === 'email' || field === 'password' || field === 'confirmPassword') {
                    setFieldError(field, { message: issue.message })
                }
            })
            return
        }

        setPending(true)
        setError(null)
        try {
            const supabase = getSupabaseBrowserClient()
            if (mode === 'login') {
                const value = values as LoginInput
                const result = await supabase.auth.signInWithPassword(value)
                if (result.error) throw result.error
                router.replace('/protected-proof')
                router.refresh()
            } else if (mode === 'signup') {
                const value = values as SignupInput
                const result = await supabase.auth.signUp({
                    email: value.email,
                    password: value.password,
                    options: { emailRedirectTo: `${appUrl()}/auth/callback?next=/protected-proof` },
                })
                if (result.error) throw result.error
                if (result.data.session) {
                    router.replace('/protected-proof')
                    router.refresh()
                } else {
                    setSuccess(true)
                }
            } else if (mode === 'forgot') {
                const value = values as ForgotPasswordInput
                const result = await supabase.auth.resetPasswordForEmail(value.email, {
                    redirectTo: `${appUrl()}/auth/callback?flow=recovery&next=/reset-password`,
                })
                if (result.error) throw result.error
                setSuccess(true)
            } else {
                const value = values as ResetPasswordInput
                const userResult = await supabase.auth.getUser()
                if (userResult.error || !userResult.data.user) {
                    throw new Error('Invalid recovery session')
                }
                const result = await supabase.auth.updateUser({ password: value.password })
                if (result.error) throw result.error
                await supabase.auth.signOut()
                await fetch('/auth/recovery/clear', { method: 'POST' })
                setSuccess(true)
            }
        } catch (caught) {
            const details =
                caught && typeof caught === 'object'
                    ? (caught as { code?: string; message?: string })
                    : {}
            setError(authErrorMessage(details, mode))
            setFieldError('root', { message: authErrorMessage(details, mode) })
        } finally {
            setPending(false)
        }
    }

    if (success) {
        const message =
            mode === 'signup'
                ? 'Account created! Please check your email to verify your account.'
                : mode === 'forgot'
                  ? 'Password reset link sent! Check your email inbox.'
                  : 'Password updated successfully!'
        return (
            <Alert
                ref={successRef}
                role="status"
                tabIndex={-1}
                variant="success"
                description={message}
            />
        )
    }

    const title =
        mode === 'login'
            ? 'Sign in'
            : mode === 'signup'
              ? 'Create account'
              : mode === 'forgot'
                ? 'Forgot password?'
                : 'Reset your password'
    const description =
        mode === 'login'
            ? undefined
            : mode === 'signup'
              ? undefined
              : mode === 'forgot'
                ? "Enter your email and we'll send you a reset link"
                : 'Choose a strong new password for your account'

    return (
        <Card title={title} description={description}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                <FormError message={errors.root?.message ?? error} />
                {mode !== 'reset' ? (
                    <TextField
                        id="email"
                        label="Email"
                        type="email"
                        autoComplete="email"
                        error={fieldErrors.email?.message}
                        required
                        {...register('email' as never)}
                    />
                ) : null}
                {mode !== 'forgot' ? (
                    <PasswordField
                        id="password"
                        label={mode === 'reset' ? 'New Password' : 'Password'}
                        autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                        error={fieldErrors.password?.message}
                        required
                        {...register('password' as never)}
                    />
                ) : null}
                {mode === 'signup' || mode === 'reset' ? (
                    <PasswordField
                        id="confirmPassword"
                        label="Confirm Password"
                        autoComplete="new-password"
                        error={fieldErrors.confirmPassword?.message}
                        required
                        {...register('confirmPassword' as never)}
                    />
                ) : null}
                <Button type="submit" className="w-full" isLoading={pending}>
                    {mode === 'login'
                        ? 'Sign in'
                        : mode === 'signup'
                          ? 'Create account'
                          : mode === 'forgot'
                            ? 'Send reset link'
                            : 'Update password'}
                </Button>
                <nav className="flex justify-center gap-3 text-center text-sm">
                    {mode !== 'login' ? (
                        <a className="underline underline-offset-4" href="/login">
                            Sign in
                        </a>
                    ) : null}
                    {mode === 'login' ? (
                        <a className="underline underline-offset-4" href="/signup">
                            Sign up
                        </a>
                    ) : null}
                    {mode === 'login' ? (
                        <a className="underline underline-offset-4" href="/forgot-password">
                            Forgot password?
                        </a>
                    ) : null}
                </nav>
            </form>
        </Card>
    )
}
