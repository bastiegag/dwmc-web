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

const toAuthServiceError = (error: unknown): AuthServiceError => {
    if (error instanceof Error) {
        const code = hasCode(error) ? error.code : undefined
        return new AuthServiceError(error.message, code)
    }
    return new AuthServiceError('An unexpected error occurred')
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
        if (error) throw toAuthServiceError(error)
        return data
    },

    async signup({ email, password }: Omit<SignupCredentials, 'confirmPassword'>) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${appUrl}/app` },
        })
        if (error) throw toAuthServiceError(error)
        return data
    },

    async forgotPassword(email: string) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${appUrl}/reset-password`,
        })
        if (error) throw toAuthServiceError(error)
    },

    async resetPassword(password: string) {
        const { data, error } = await supabase.auth.updateUser({ password })
        if (error) throw toAuthServiceError(error)
        return data
    },

    async logout() {
        const { error } = await supabase.auth.signOut()
        if (error) throw toAuthServiceError(error)
    },

    async getSession() {
        const { data, error } = await supabase.auth.getSession()
        if (error) throw toAuthServiceError(error)
        return data.session
    },

    onAuthStateChange(callback: Parameters<typeof supabase.auth.onAuthStateChange>[0]) {
        return supabase.auth.onAuthStateChange(callback)
    },
}
