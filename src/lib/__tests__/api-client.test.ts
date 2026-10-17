import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError, apiClient } from '../api-client'
import { configureBrowserApiAdapter } from '../browser-api-adapter'

const { getSessionMock, signOutMock } = vi.hoisted(() => ({
    getSessionMock: vi.fn(),
    signOutMock: vi.fn(),
}))

describe('apiClient', () => {
    beforeEach(() => {
        getSessionMock.mockResolvedValue({ data: { session: null } })
        signOutMock.mockResolvedValue({ error: null })
        vi.restoreAllMocks()
        vi.stubGlobal('fetch', vi.fn())
        configureBrowserApiAdapter({
            baseUrl: 'http://localhost:8787///',
            getAccessToken: async () => {
                const {
                    data: { session },
                } = await getSessionMock()
                return session?.access_token
            },
            onUnauthorized: async () => {
                await signOutMock()
            },
        })
    })

    it('normalizes the base URL and includes an access token', async () => {
        getSessionMock.mockResolvedValue({ data: { session: { access_token: 'token-123' } } })
        vi.mocked(fetch).mockResolvedValue(
            new Response(JSON.stringify({ data: 'ok' }), {
                status: 200,
                headers: { 'content-type': 'application/json' },
            }),
        )

        await expect(apiClient('/accounts')).resolves.toEqual({ data: 'ok' })
        expect(fetch).toHaveBeenCalledWith('http://localhost:8787/accounts', {
            method: 'GET',
            headers: { Authorization: 'Bearer token-123' },
        })
    })

    it('normalizes paths without a leading slash and serializes request bodies', async () => {
        vi.mocked(fetch).mockResolvedValue(new Response('{}', { status: 201 }))

        await apiClient('accounts', {
            method: 'POST',
            body: { name: 'Checking' },
            headers: { 'X-Test': 'true' },
        })

        expect(fetch).toHaveBeenCalledWith('http://localhost:8787/accounts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Test': 'true' },
            body: JSON.stringify({ name: 'Checking' }),
        })
    })

    it('maps network failures to an ApiError', async () => {
        vi.mocked(fetch).mockRejectedValue(new TypeError('offline'))

        await expect(apiClient('/accounts')).rejects.toMatchObject({
            status: 0,
            code: 'NETWORK_ERROR',
            message: 'Unable to connect to the API.',
        })
    })

    it('maps unauthorized responses and signs out', async () => {
        vi.mocked(fetch).mockResolvedValue(
            new Response(JSON.stringify({ error: { code: 'UNAUTHORIZED' } }), {
                status: 401,
                headers: { 'content-type': 'application/json' },
            }),
        )

        await expect(apiClient('/accounts')).rejects.toMatchObject({
            status: 401,
            code: 'UNAUTHORIZED',
        })
        expect(signOutMock).toHaveBeenCalledOnce()
    })

    it('uses the fallback message for non-JSON error responses', async () => {
        vi.mocked(fetch).mockResolvedValue(new Response('bad gateway', { status: 502 }))

        await expect(apiClient('/accounts')).rejects.toEqual(
            expect.objectContaining({
                status: 502,
                message: 'Request failed with status 502',
            }),
        )
    })

    it('preserves structured error issues', async () => {
        vi.mocked(fetch).mockResolvedValue(
            new Response(
                JSON.stringify({
                    error: { message: 'Invalid account', issues: [{ path: ['name'] }] },
                }),
                { status: 422, headers: { 'content-type': 'application/json' } },
            ),
        )

        await expect(apiClient('/accounts')).rejects.toEqual(
            expect.objectContaining({
                status: 422,
                message: 'Invalid account',
                issues: [{ path: ['name'] }],
            }),
        )
    })

    it('exposes ApiError as an Error subtype', () => {
        const error = new ApiError({ message: 'failed', status: 500 })
        expect(error).toBeInstanceOf(Error)
        expect(error.name).toBe('ApiError')
    })
})
