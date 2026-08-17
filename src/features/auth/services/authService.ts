import { supabase } from '@/lib/supabase'
import { AuthServiceError } from '@/features/auth/types'
import type { LoginCredentials, SignupCredentials } from '@/features/auth/types'

const hasCode = (value: unknown): value is { code: string } => {
    return (
        typeof value === 'object' &&
        value !== null &&
        'code' in value &&
        typeof (value as Record<string, unknown>).code === 'string'
    )
}

type AuthOperation = 'login' | 'signup' | 'recovery' | 'reset' | 'logout' | 'session'

const getErrorText = (error: unknown): string => {
    if (error instanceof Error) return error.message.toLowerCase()
    if (typeof error === 'object' && error !== null && 'message' in error) {
        const message = (error as { message?: unknown }).message
        if (typeof message === 'string') return message.toLowerCase()
    }
    return ''
}

const toAuthServiceError = (error: unknown, operation: AuthOperation): AuthServiceError => {
    const code = hasCode(error) ? error.code : undefined
    const text = getErrorText(error)

    if (
        operation === 'login' &&
        (code === 'invalid_credentials' || text.includes('invalid login'))
    ) {
        return new AuthServiceError('The email or password is incorrect.', 'INVALID_CREDENTIALS')
    }

    if (
        operation === 'signup' &&
        (code === 'user_already_exists' || text.includes('already registered'))
    ) {
        return new AuthServiceError('An account with this email already exists.', 'EMAIL_IN_USE')
    }

    if (code === 'over_request_rate_limit' || text.includes('rate limit')) {
        return new AuthServiceError(
            'Too many attempts. Please wait a moment and try again.',
            'RATE_LIMITED',
        )
    }

    if (operation === 'recovery') {
        return new AuthServiceError(
            'We could not send a password reset link. Please try again.',
            'RECOVERY_FAILED',
        )
    }

    if (operation === 'reset') {
        return new AuthServiceError(
            'We could not update your password. Please request a new reset link.',
            'RESET_FAILED',
        )
    }

    if (operation === 'logout') {
        return new AuthServiceError('We could not sign you out. Please try again.', 'LOGOUT_FAILED')
    }

    return new AuthServiceError('Something went wrong. Please try again.', 'AUTH_FAILED')
}
const appUrl = import.meta.env.VITE_APP_URL

export const validateEnv = (): void => {
    if (!appUrl) {
        throw new Error(
            'Missing VITE_APP_URL. Set it to the app origin (e.g. https://example.com).',
        )
    }
}

export const authService = {
    async login({ email, password }: LoginCredentials) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw toAuthServiceError(error, 'login')
        return data
    },

    async signup({ email, password }: Omit<SignupCredentials, 'confirmPassword'>) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${appUrl}/dashboard` },
        })
        if (error) throw toAuthServiceError(error, 'signup')
        return data
    },

    async forgotPassword(email: string) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${appUrl}/reset-password`,
        })
        if (error) throw toAuthServiceError(error, 'recovery')
    },

    async resetPassword(password: string) {
        const { data, error } = await supabase.auth.updateUser({ password })
        if (error) throw toAuthServiceError(error, 'reset')
        return data
    },

    async logout() {
        const { error } = await supabase.auth.signOut()
        if (error) throw toAuthServiceError(error, 'logout')
    },

    async getSession() {
        const { data, error } = await supabase.auth.getSession()
        if (error) throw toAuthServiceError(error, 'session')
        return data.session
    },

    onAuthStateChange(callback: Parameters<typeof supabase.auth.onAuthStateChange>[0]) {
        return supabase.auth.onAuthStateChange(callback)
    },
}
