import { supabase } from '@/lib/supabase'

export class ApiError extends Error {
    constructor(
        message: string,
        public readonly status: number,
        public readonly code?: string,
    ) {
        super(message)
        this.name = 'ApiError'
    }
}

export interface ApiResponse<T> {
    data: T
    error: null
}

export interface ApiErrorResponse {
    data: null
    error: ApiError
}

async function getAuthHeaders(): Promise<Record<string, string>> {
    const {
        data: { session },
    } = await supabase.auth.getSession()
    if (!session?.access_token) return {}
    return { Authorization: `Bearer ${session.access_token}` }
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const authHeaders = await getAuthHeaders()
    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...authHeaders,
            ...options.headers,
        },
    })
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new ApiError(
            (errorData as { message?: string }).message ?? 'An unexpected error occurred',
            response.status,
            (errorData as { code?: string }).code,
        )
    }
    return response.json() as Promise<T>
}

export const apiClient = {
    get: <T>(url: string, options?: RequestInit) => request<T>(url, { ...options, method: 'GET' }),
    post: <T>(url: string, body: unknown, options?: RequestInit) =>
        request<T>(url, { ...options, method: 'POST', body: JSON.stringify(body) }),
    put: <T>(url: string, body: unknown, options?: RequestInit) =>
        request<T>(url, { ...options, method: 'PUT', body: JSON.stringify(body) }),
    patch: <T>(url: string, body: unknown, options?: RequestInit) =>
        request<T>(url, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
    delete: <T>(url: string, options?: RequestInit) =>
        request<T>(url, { ...options, method: 'DELETE' }),
}
