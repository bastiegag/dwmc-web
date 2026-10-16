import { beforeEach, describe, expect, it, vi } from 'vitest'
import { serverApiClient } from '../api-client.server'

const { getUserMock, getSessionMock } = vi.hoisted(() => ({
    getUserMock: vi.fn(),
    getSessionMock: vi.fn(),
}))

vi.mock('../supabase/server', () => ({
    createSupabaseServerClient: async () => ({
        auth: {
            getUser: getUserMock,
            getSession: getSessionMock,
        },
    }),
}))

describe('serverApiClient', () => {
    beforeEach(() => {
        getUserMock.mockResolvedValue({
            data: { user: { id: 'user-1' } },
            error: null,
        })
        getSessionMock.mockResolvedValue({
            data: {
                session: {
                    user: { id: 'user-1' },
                    access_token: 'token-123',
                },
            },
        })
        vi.stubEnv('DWMC_API_URL', 'http://api.example.test/api/v1///')
        vi.stubGlobal('fetch', vi.fn())
    })

    it('verifies the user, forwards the matching token, and disables caching', async () => {
        vi.mocked(fetch).mockResolvedValue(
            new Response(JSON.stringify({ data: { status: 'ok' } }), {
                status: 200,
                headers: { 'content-type': 'application/json' },
            }),
        )

        await expect(
            serverApiClient('/auth/me', {
                method: 'POST',
                body: { refresh: true },
            }),
        ).resolves.toEqual({ data: { status: 'ok' } })

        expect(fetch).toHaveBeenCalledWith('http://api.example.test/api/v1/auth/me', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer token-123',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: true }),
            cache: 'no-store',
        })
    })

    it('rejects missing or unverifiable sessions before making a request', async () => {
        getUserMock.mockResolvedValue({ data: { user: null }, error: null })

        await expect(serverApiClient('/accounts')).rejects.toMatchObject({
            status: 401,
            code: 'UNAUTHORIZED',
        })
        expect(fetch).not.toHaveBeenCalled()
    })

    it('rejects a token belonging to a different user', async () => {
        getSessionMock.mockResolvedValue({
            data: {
                session: {
                    user: { id: 'user-2' },
                    access_token: 'token-123',
                },
            },
        })

        await expect(serverApiClient('/accounts')).rejects.toMatchObject({
            status: 401,
            code: 'UNAUTHORIZED',
        })
        expect(fetch).not.toHaveBeenCalled()
    })

    it('maps malformed and empty error responses consistently', async () => {
        vi.mocked(fetch).mockResolvedValue(
            new Response('{invalid', {
                status: 502,
                headers: { 'content-type': 'application/json' },
            }),
        )

        await expect(serverApiClient('/accounts')).rejects.toMatchObject({
            status: 502,
            message: 'Request failed with status 502',
        })
    })

    it('maps network failures to an ApiError', async () => {
        vi.mocked(fetch).mockRejectedValue(new TypeError('offline'))

        await expect(serverApiClient('/accounts')).rejects.toMatchObject({
            status: 0,
            code: 'NETWORK_ERROR',
        })
    })
})
