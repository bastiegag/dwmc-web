import {
    ApiError,
    createApiError,
    getRequestHeaders,
    parseApiResponse,
    type ApiClientOptions,
} from './api-client.shared'
import { getBrowserApiAdapter } from './browser-api-adapter'

export { ApiError, type ApiClientOptions } from './api-client.shared'

const buildApiUrl = (path: string): string => {
    const normalised = path.startsWith('/') ? path : `/${path}`
    return `${getBrowserApiAdapter().baseUrl}${normalised}`
}

export const apiClient = async <T>(path: string, options: ApiClientOptions = {}): Promise<T> => {
    const method = options.method ?? 'GET'
    const adapter = getBrowserApiAdapter()
    const authToken = await adapter.getAccessToken()
    const headers = getRequestHeaders({ ...options, method }, authToken)

    let response: Response
    try {
        response = await fetch(buildApiUrl(path), {
            method,
            headers,
            ...(options.body !== undefined && method !== 'GET'
                ? { body: JSON.stringify(options.body) }
                : {}),
            ...(options.signal ? { signal: options.signal } : {}),
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

    if (response.status === 401) {
        await adapter.onUnauthorized()
    }

    throw createApiError(response, payload)
}
