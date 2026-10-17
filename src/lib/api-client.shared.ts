import { ApiError } from './api-error'

export type ApiClientOptions = {
    method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
    body?: unknown
    headers?: HeadersInit
    signal?: AbortSignal
}

type BackendErrorBody = {
    error?: {
        code?: string
        message?: string
        issues?: unknown
    }
}

export const parseApiResponse = async (response: Response): Promise<unknown> => {
    const contentType = response.headers.get('content-type') ?? ''
    if (!contentType.includes('application/json')) return undefined

    const text = await response.text()
    if (!text) return undefined

    try {
        return JSON.parse(text)
    } catch {
        return undefined
    }
}

export const createApiError = (response: Response, payload: unknown): ApiError => {
    const error = (payload as BackendErrorBody | undefined)?.error

    return new ApiError({
        status: response.status,
        code: error?.code,
        message: error?.message ?? `Request failed with status ${response.status}`,
        issues: error?.issues,
    })
}

export const getRequestHeaders = (options: ApiClientOptions, authToken?: string): HeadersInit => {
    const hasBody = options.body !== undefined && options.method !== 'GET'
    const headers: Record<string, string> =
        options.headers instanceof Headers
            ? Object.fromEntries(options.headers.entries())
            : Array.isArray(options.headers)
              ? Object.fromEntries(options.headers)
              : { ...(options.headers ?? {}) }
    const hasHeader = (name: string) =>
        Object.keys(headers).some((headerName) => headerName.toLowerCase() === name.toLowerCase())

    if (hasBody && !hasHeader('Content-Type')) {
        headers['Content-Type'] = 'application/json'
    }
    if (authToken) {
        headers.Authorization = `Bearer ${authToken}`
    }

    return headers
}

export { ApiError }
