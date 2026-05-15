import { createClient } from '@supabase/supabase-js'

function getSupabaseClient() {
    const url = import.meta.env.VITE_SUPABASE_URL ?? 'https://placeholder.supabase.co'
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'placeholder-key'
    return createClient(url, key)
}

export const supabase = getSupabaseClient()
