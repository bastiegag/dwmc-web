import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { render, screen, waitFor } from '@testing-library/react'
import { server } from '@/test/mocks/server'
import { ProfilePage } from './ProfilePage'

vi.mock('@/features/auth', () => ({
    useAuth: () => ({ user: { email: 'ada@example.com' } }),
}))

const API_URL = 'http://localhost:8787'

const profile = {
    id: 'profile-1',
    authUserId: 'mock-user-id',
    firstName: 'Ada',
    lastName: 'Lovelace',
    displayName: 'Ada',
    preferredCurrency: 'CAD',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
}

const createQueryClient = () =>
    new QueryClient({
        defaultOptions: { queries: { retry: false, gcTime: 0 } },
    })

const renderPage = (queryClient = createQueryClient()) => ({
    queryClient,
    ...render(
        <QueryClientProvider client={queryClient}>
            <ProfilePage />
        </QueryClientProvider>,
    ),
})

describe('ProfilePage', () => {
    beforeEach(() => {
        vi.stubEnv('VITE_API_URL', API_URL)
    })

    it('renders cached profile data when a background refresh fails and retries', async () => {
        const user = userEvent.setup()
        const { queryClient } = renderPage()

        expect(await screen.findByLabelText('First name')).toHaveValue('Ada')

        let shouldFailRefresh = true
        server.use(
            http.get(`${API_URL}/profile`, () =>
                shouldFailRefresh
                    ? HttpResponse.json(
                          { error: { code: 'SERVER_ERROR', message: 'Profile refresh failed.' } },
                          { status: 500 },
                      )
                    : HttpResponse.json({ data: profile }),
            ),
        )
        await queryClient.invalidateQueries({ queryKey: ['profile'] })

        expect(await screen.findByText('Profile refresh failed')).toBeInTheDocument()
        expect(screen.getByLabelText('First name')).toHaveValue('Ada')
        expect(screen.getByRole('status')).toHaveTextContent('Profile refresh failed.')

        shouldFailRefresh = false
        await user.click(screen.getByRole('button', { name: 'Retry' }))
        await waitFor(() =>
            expect(screen.queryByText('Profile refresh failed')).not.toBeInTheDocument(),
        )
        expect(screen.getByLabelText('First name')).toHaveValue('Ada')
    })

    it('shows a retryable query error when the initial profile load fails', async () => {
        const user = userEvent.setup()
        let shouldFail = true
        server.use(
            http.get(`${API_URL}/profile`, () =>
                shouldFail
                    ? HttpResponse.json(
                          { error: { code: 'SERVER_ERROR', message: 'Profile unavailable.' } },
                          { status: 500 },
                      )
                    : HttpResponse.json({ data: profile }),
            ),
        )
        renderPage()

        expect(await screen.findByRole('alert')).toHaveTextContent('Profile unavailable.')
        expect(screen.queryByLabelText('First name')).not.toBeInTheDocument()

        shouldFail = false
        await user.click(screen.getByRole('button', { name: 'Retry' }))
        expect(await screen.findByLabelText('First name')).toHaveValue('Ada')
    })
})
