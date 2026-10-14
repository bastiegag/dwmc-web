import { ApiError } from './api-error'
import { createSupabaseServerClient } from './supabase/server'

const getApiBaseUrl = () => {
    const url = process.env.DWMC_API_URL
    if (!url) throw new Error('DWMC_API_URL is not defined.')
    return url.replace(/\/+$/, '')
}

export async function serverApiClient<T>(path: string): Promise<T> {
    const supabase = await createSupabaseServerClient()
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
        throw new ApiError({
            status: 401,
            code: 'UNAUTHORIZED',
            message: 'The authenticated user could not be verified.',
        })
    }
    const {
        data: { session },
    } = await supabase.auth.getSession()
    const token = session?.access_token

    if (!token || session.user.id !== user.id) {
        throw new ApiError({
            status: 401,
            code: 'UNAUTHORIZED',
            message: 'No authenticated Supabase access token is available.',
        })
    }

    const response = await fetch(`${getApiBaseUrl()}/${path.replace(/^\/+/, '')}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
    })
    const contentType = response.headers.get('content-type') ?? ''
    const json = contentType.includes('application/json') ? await response.json() : undefined

    if (response.ok) return json as T

    const error = (json as { error?: { code?: string; message?: string; issues?: unknown } })?.error
    throw new ApiError({
        status: response.status,
        code: error?.code,
        message: error?.message ?? `Request failed with status ${response.status}`,
        issues: error?.issues,
    })
}
