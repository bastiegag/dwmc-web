import { supabase } from '@/lib/supabase'
import { AuthServiceError, AuthErrorCode, getAuthErrorMessage } from '@/features/auth/types'
import type { LoginCredentials, SignupCredentials } from '@/features/auth/types'

const AUTH_ERROR_CODE_VALUES = new Set<string>(Object.values(AuthErrorCode))

function toAuthErrorCode(raw: unknown): AuthErrorCode | undefined {
    if (typeof raw === 'string' && AUTH_ERROR_CODE_VALUES.has(raw)) {
        return raw as AuthErrorCode
    }
    return undefined
}

function toAuthServiceError(error: unknown): AuthServiceError {
    if (error instanceof Error) {
        const code = toAuthErrorCode((error as { code?: unknown }).code)
        const message = getAuthErrorMessage(code, error.message)
        return new AuthServiceError(message, code)
    }
    return new AuthServiceError('An unexpected error occurred')
}

/**
 * Races `promise` against `signal`. If the signal aborts before the promise
 * settles, the returned promise rejects with a DOMException AbortError and the
 * abort listener is cleaned up. If the promise settles first the abort listener
 * is also cleaned up to avoid a memory leak.
 *
 * When no signal is provided the original promise is returned unchanged.
 */
function withSignal<T>(promise: Promise<T>, signal?: AbortSignal): Promise<T> {
    if (!signal) return promise
    return new Promise<T>((resolve, reject) => {
        const rejectAbort = () => reject(new DOMException('Aborted', 'AbortError'))
        if (signal.aborted) {
            rejectAbort()
            return
        }
        signal.addEventListener('abort', rejectAbort, { once: true })
        promise.then(
            (value) => {
                signal.removeEventListener('abort', rejectAbort)
                resolve(value)
            },
            (reason: unknown) => {
                signal.removeEventListener('abort', rejectAbort)
                reject(reason)
            },
        )
    })
}
const appUrl = import.meta.env.VITE_APP_URL
if (!appUrl) {
    throw new Error('Missing VITE_APP_URL. Set it to the app origin (e.g. https://example.com).')
}

export const authService = {
    async login({ email, password }: LoginCredentials, signal?: AbortSignal) {
        const { data, error } = await withSignal(
            supabase.auth.signInWithPassword({ email, password }),
            signal,
        )
        if (error) throw toAuthServiceError(error)
        return data
    },

    async signup(
        { email, password }: Omit<SignupCredentials, 'confirmPassword'>,
        signal?: AbortSignal,
    ) {
        const { data, error } = await withSignal(
            supabase.auth.signUp({
                email,
                password,
                options: { emailRedirectTo: `${appUrl}/app` },
            }),
            signal,
        )
        if (error) throw toAuthServiceError(error)
        return data
    },

    async forgotPassword(email: string, signal?: AbortSignal) {
        const { error } = await withSignal(
            supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${appUrl}/reset-password`,
            }),
            signal,
        )
        if (error) throw toAuthServiceError(error)
    },

    async resetPassword(password: string, signal?: AbortSignal) {
        const { data, error } = await withSignal(supabase.auth.updateUser({ password }), signal)
        if (error) throw toAuthServiceError(error)
        return data
    },

    async logout(signal?: AbortSignal) {
        const { error } = await withSignal(supabase.auth.signOut(), signal)
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
