import { getAuthAppUrl, getAuthClient } from '@/lib/auth-client'
import { AuthServiceError } from '@/features/auth/types'
import type { LoginCredentials, SignupCredentials } from '@/features/auth/types'
import type { SupabaseClient } from '@supabase/supabase-js'

type AuthOperation = 'login' | 'signup' | 'recovery' | 'reset' | 'logout' | 'session'

const getErrorDetails = (error: unknown): { code?: string; text: string } => {
    if (typeof error !== 'object' || error === null) return { text: '' }

    const details = error as { code?: unknown; message?: unknown }
    return {
        code: typeof details.code === 'string' ? details.code : undefined,
        text: typeof details.message === 'string' ? details.message.toLowerCase() : '',
    }
}

const toAuthServiceError = (error: unknown, operation: AuthOperation): AuthServiceError => {
    const { code, text } = getErrorDetails(error)

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
export const validateEnv = (): void => {
    getAuthAppUrl()
}

export const authService = {
    async login({ email, password }: LoginCredentials) {
        const { data, error } = await getAuthClient().auth.signInWithPassword({ email, password })
        if (error) throw toAuthServiceError(error, 'login')
        return data
    },

    async signup({ email, password }: Omit<SignupCredentials, 'confirmPassword'>) {
        const { data, error } = await getAuthClient().auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${getAuthAppUrl()}/dashboard` },
        })
        if (error) throw toAuthServiceError(error, 'signup')
        return data
    },

    async forgotPassword(email: string) {
        const { error } = await getAuthClient().auth.resetPasswordForEmail(email, {
            redirectTo: `${getAuthAppUrl()}/reset-password`,
        })
        if (error) throw toAuthServiceError(error, 'recovery')
    },

    async resetPassword(password: string) {
        const { data, error } = await getAuthClient().auth.updateUser({ password })
        if (error) throw toAuthServiceError(error, 'reset')
        return data
    },

    async logout() {
        const { error } = await getAuthClient().auth.signOut()
        if (error) throw toAuthServiceError(error, 'logout')
    },

    async getSession() {
        const { data, error } = await getAuthClient().auth.getSession()
        if (error) throw toAuthServiceError(error, 'session')
        return data.session
    },

    onAuthStateChange(callback: Parameters<SupabaseClient['auth']['onAuthStateChange']>[0]) {
        return getAuthClient().auth.onAuthStateChange(callback)
    },
}
