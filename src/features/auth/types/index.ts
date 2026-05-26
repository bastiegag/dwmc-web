import type { User, Session } from '@supabase/supabase-js'

export type { User, Session }

export class AuthServiceError extends Error {
    readonly code?: string

    constructor(message: string, code?: string) {
        super(message)
        this.name = 'AuthServiceError'
        this.code = code
    }
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
