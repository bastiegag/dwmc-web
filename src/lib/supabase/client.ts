import { createClient } from '@supabase/supabase-js'

export const recoveryCallbackStorageKey = 'dwmc-auth-recovery-callback'

const preserveRecoveryCallback = () => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.hash.slice(1))
    if (params.get('type') === 'recovery') {
        window.sessionStorage.setItem(recoveryCallbackStorageKey, 'true')
    }
}

const getSupabaseClient = () => {
    const url = import.meta.env.VITE_SUPABASE_URL
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY
    if (!url || !key) {
        throw new Error(
            'Missing Supabase configuration. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
        )
    }
    preserveRecoveryCallback()
    return createClient(url, key)
}

export const supabase = getSupabaseClient()
