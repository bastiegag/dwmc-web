import type { User, Session } from '@supabase/supabase-js'

export type { User, Session }

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

export interface AuthError {
    message: string
    code?: string
}
