import { describe, it, expect } from 'vitest'
import { ApiError } from '@/lib/api'

describe('ApiError', () => {
    it('is an instance of Error', () => {
        const err = new ApiError('something failed', 500)
        expect(err).toBeInstanceOf(Error)
    })

    it('sets the message correctly', () => {
        const err = new ApiError('not found', 404)
        expect(err.message).toBe('not found')
    })

    it('sets the status correctly', () => {
        const err = new ApiError('forbidden', 403)
        expect(err.status).toBe(403)
    })

    it('sets name to ApiError', () => {
        const err = new ApiError('bad request', 400)
        expect(err.name).toBe('ApiError')
    })

    it('stores an optional code', () => {
        const err = new ApiError('rate limited', 429, 'RATE_LIMIT')
        expect(err.code).toBe('RATE_LIMIT')
    })

    it('code is undefined when not provided', () => {
        const err = new ApiError('internal error', 500)
        expect(err.code).toBeUndefined()
    })
})
