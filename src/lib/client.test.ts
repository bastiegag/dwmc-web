import { describe, expect, it } from 'vitest'
import { queryClient } from '../query/client'

describe('queryClient retry policy', () => {
    const retry = queryClient.getDefaultOptions().queries?.retry
    const retryFn = retry as (failureCount: number, error: unknown) => boolean

    it('does not retry client errors', () => {
        expect(typeof retry).toBe('function')
        expect(retryFn(0, { status: 400 })).toBe(false)
    })

    it('retries server errors until the third failure', () => {
        expect(retryFn(0, { status: 500 })).toBe(true)
        expect(retryFn(2, { status: 500 })).toBe(true)
        expect(retryFn(3, { status: 500 })).toBe(false)
    })

    it('retries errors without an HTTP status until the limit', () => {
        expect(retryFn(1, new Error('offline'))).toBe(true)
    })
})
