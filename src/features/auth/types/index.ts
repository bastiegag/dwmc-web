import type { User, Session } from '@supabase/supabase-js'

export type { User, Session }

/**
 * Machine-readable codes for auth errors surfaced by this application.
 * Subset of Supabase's GoTrue ErrorCode values that are relevant to the
 * features implemented here.  Use these for conditional UI logic, i18n, and
 * analytics — never pattern-match on raw message strings.
 */
export const AuthErrorCode = {
    INVALID_CREDENTIALS: 'invalid_credentials',
    EMAIL_NOT_CONFIRMED: 'email_not_confirmed',
    USER_ALREADY_EXISTS: 'user_already_exists',
    EMAIL_EXISTS: 'email_exists',
    WEAK_PASSWORD: 'weak_password',
    SAME_PASSWORD: 'same_password',
    SIGNUP_DISABLED: 'signup_disabled',
    USER_BANNED: 'user_banned',
    SESSION_EXPIRED: 'session_expired',
    SESSION_NOT_FOUND: 'session_not_found',
    OVER_REQUEST_RATE_LIMIT: 'over_request_rate_limit',
    OVER_EMAIL_SEND_RATE_LIMIT: 'over_email_send_rate_limit',
    REQUEST_TIMEOUT: 'request_timeout',
    UNEXPECTED_FAILURE: 'unexpected_failure',
} as const

export type AuthErrorCode = (typeof AuthErrorCode)[keyof typeof AuthErrorCode]

const AUTH_ERROR_MESSAGES: Record<AuthErrorCode, string> = {
    invalid_credentials: 'Invalid email or password.',
    email_not_confirmed: 'Please verify your email before signing in.',
    user_already_exists: 'An account with this email already exists.',
    email_exists: 'An account with this email already exists.',
    weak_password: 'Your password is too weak. Please choose a stronger one.',
    same_password: 'Your new password must be different from your current password.',
    signup_disabled: 'New sign-ups are currently disabled.',
    user_banned: 'Your account has been suspended. Please contact support.',
    session_expired: 'Your session has expired. Please sign in again.',
    session_not_found: 'Session not found. Please sign in again.',
    over_request_rate_limit: 'Too many requests. Please wait a moment and try again.',
    over_email_send_rate_limit: 'Too many emails sent. Please wait before requesting another.',
    request_timeout: 'The request timed out. Please check your connection and try again.',
    unexpected_failure: 'An unexpected error occurred. Please try again.',
}

/**
 * Returns a user-friendly message for the given error code, falling back to
 * `fallback` (or a generic message) when the code is unknown.
 */
export function getAuthErrorMessage(code: AuthErrorCode | undefined, fallback?: string): string {
    if (code !== undefined) return AUTH_ERROR_MESSAGES[code]
    return fallback ?? 'An unexpected error occurred.'
}

export class AuthServiceError extends Error {
    readonly code: AuthErrorCode | undefined

    constructor(message: string, code?: AuthErrorCode) {
        super(message)
        this.name = 'AuthServiceError'
        this.code = code
    }
}

export interface AuthState {
    user: User | null
    session: Session | null
    isLoading: boolean
    isAuthenticated: boolean
}

export interface LoginCredentials {
    email: string
    password: string
}

export interface SignupCredentials {
    email: string
    password: string
    confirmPassword: string
}

export interface ForgotPasswordData {
    email: string
}

export interface ResetPasswordData {
    password: string
    confirmPassword: string
}
