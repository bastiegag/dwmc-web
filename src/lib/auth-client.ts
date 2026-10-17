import type { SupabaseClient } from '@supabase/supabase-js'

export const recoveryCallbackStorageKey = 'dwmc-auth-recovery-callback'

let client: SupabaseClient | null = null
let appUrl: string | null = null

export const configureAuthClient = (nextClient: SupabaseClient, nextAppUrl: string) => {
    client = nextClient
    appUrl = nextAppUrl
}

export const getAuthClient = (): SupabaseClient => {
    if (!client) {
        throw new Error('Auth client has not been configured by the active runtime provider.')
    }
    return client
}

export const getAuthAppUrl = (): string => {
    if (!appUrl) {
        throw new Error('Auth app URL has not been configured by the active runtime provider.')
    }
    return appUrl
}
