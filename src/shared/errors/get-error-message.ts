import { ApiError } from '@/lib/api-client'

export const getErrorMessage = (error: unknown, fallback: string): string => {
    if (error instanceof ApiError || error instanceof Error) {
        return error.message || fallback
    }

    if (typeof error === 'object' && error !== null && 'message' in error) {
        const message = error.message
        return typeof message === 'string' && message ? message : fallback
    }

    return fallback
}
