import {
    ApiError,
    createApiError,
    getRequestHeaders,
    parseApiResponse,
    type ApiClientOptions,
} from './api-client.shared'
import { createSupabaseServerClient } from './supabase/server'

const getApiBaseUrl = () => {
    const url = process.env.DWMC_API_URL
    if (!url) throw new Error('DWMC_API_URL is not defined.')
    return url.replace(/\/+$/, '')
}

export async function serverApiClient<T>(path: string, options: ApiClientOptions = {}): Promise<T> {
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

    const method = options.method ?? 'GET'
    let response: Response
    try {
        response = await fetch(`${getApiBaseUrl()}/${path.replace(/^\/+/, '')}`, {
            method,
            headers: getRequestHeaders({ ...options, method }, token),
            ...(options.body !== undefined && method !== 'GET'
                ? { body: JSON.stringify(options.body) }
                : {}),
            ...(options.signal ? { signal: options.signal } : {}),
            cache: 'no-store',
        })
    } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') throw error
        throw new ApiError({
            status: 0,
            code: 'NETWORK_ERROR',
            message: 'Unable to connect to the API.',
        })
    }

    const payload = await parseApiResponse(response)
    if (response.ok) return payload as T
    throw createApiError(response, payload)
}

export { ApiError, type ApiClientOptions } from './api-client.shared'
