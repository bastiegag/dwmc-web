import { supabase } from '@/lib/supabase'

// ---------------------------------------------------------------------------
// ApiError
// ---------------------------------------------------------------------------

export class ApiError extends Error {
    status: number
    code?: string
    issues?: unknown

    constructor({
        message,
        status,
        code,
        issues,
    }: {
        message: string
        status: number
        code?: string
        issues?: unknown
    }) {
        super(message)
        this.name = 'ApiError'
        this.status = status
        this.code = code
        this.issues = issues
    }
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

const getApiBaseUrl = (): string => {
    const url = import.meta.env.VITE_API_URL
    if (!url) {
        throw new Error(
            '[apiClient] VITE_API_URL is not defined. ' + 'Add it to your .env.local file.',
        )
    }
    // Strip trailing slash so we can always prefix paths with /
    return url.replace(/\/$/, '')
}

const buildApiUrl = (path: string): string => {
    const base = getApiBaseUrl()
    // Ensure path always starts with /
    const normalised = path.startsWith('/') ? path : `/${path}`
    return `${base}${normalised}`
}

const getAuthHeaders = async (): Promise<HeadersInit> => {
    const {
        data: { session },
    } = await supabase.auth.getSession()

    if (session?.access_token) {
        return { Authorization: `Bearer ${session.access_token}` }
    }

    return {}
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ApiClientOptions = {
    method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
    body?: unknown
    headers?: HeadersInit
}

// Shape of backend error envelope
interface BackendErrorBody {
    error?: {
        code?: string
        message?: string
        issues?: unknown
    }
}

// ---------------------------------------------------------------------------
// Core client
// ---------------------------------------------------------------------------

export const apiClient = async <T>(path: string, options: ApiClientOptions = {}): Promise<T> => {
    const { method = 'GET', body, headers: extraHeaders } = options

    const url = buildApiUrl(path)
    const authHeaders = await getAuthHeaders()

    const hasBody = body !== undefined && method !== 'GET'

    const headers: HeadersInit = {
        ...authHeaders,
        ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
        ...extraHeaders,
    }

    let response: Response

    try {
        response = await fetch(url, {
            method,
            headers,
            ...(hasBody ? { body: JSON.stringify(body) } : {}),
        })
    } catch {
        throw new ApiError({
            status: 0,
            code: 'NETWORK_ERROR',
            message: 'Unable to connect to the API.',
        })
    }

    // Parse response body — guard against empty or non-JSON payloads
    let json: unknown = undefined

    const contentType = response.headers.get('content-type') ?? ''
    const isJson = contentType.includes('application/json')

    if (isJson) {
        try {
            json = await response.json()
        } catch {
            // Non-parseable JSON — treat as empty
            json = undefined
        }
    }

    // Happy path
    if (response.ok) {
        return json as T
    }

    // Error path — try to read the standard error envelope
    const errorBody = json as BackendErrorBody | undefined

    const errorPayload = errorBody?.error

    throw new ApiError({
        status: response.status,
        code: errorPayload?.code,
        message: errorPayload?.message ?? `Request failed with status ${response.status}`,
        issues: errorPayload?.issues,
    })
}
