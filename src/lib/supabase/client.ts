import { createClient } from '@supabase/supabase-js'

function getSupabaseClient() {
    const url = import.meta.env.VITE_SUPABASE_URL
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY
    if (!url || !key) {
        throw new Error(
            'Missing Supabase configuration. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
        )
    }
    return createClient(url, key)
}

export const supabase = getSupabaseClient()
