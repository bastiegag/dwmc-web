import { supabase } from '@/lib/supabase'
import type { LoginCredentials, SignupCredentials } from '@/features/auth/types'

export const authService = {
    async login({ email, password }: LoginCredentials) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        return data
    },

    async signup({ email, password }: Omit<SignupCredentials, 'confirmPassword'>) {
        const appUrl = import.meta.env.VITE_APP_URL
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${appUrl}/app` },
        })
        if (error) throw error
        return data
    },

    async forgotPassword(email: string) {
        const appUrl = import.meta.env.VITE_APP_URL
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${appUrl}/reset-password`,
        })
        if (error) throw error
    },

    async resetPassword(password: string) {
        const { data, error } = await supabase.auth.updateUser({ password })
        if (error) throw error
        return data
    },

    async logout() {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
    },

    async getSession() {
        const { data, error } = await supabase.auth.getSession()
        if (error) throw error
        return data.session
    },

    onAuthStateChange(callback: Parameters<typeof supabase.auth.onAuthStateChange>[0]) {
        return supabase.auth.onAuthStateChange(callback)
    },
}
