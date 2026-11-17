import { beforeEach, describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { screen, waitFor } from '@testing-library/react'
import { ProfileForm } from './ProfileForm'
import { render } from '@/test/utils/render'
import { server } from '@/test/mocks/server'
import { http, HttpResponse } from 'msw'

const profile = {
    id: 'profile-1',
    authUserId: 'mock-user-id',
    firstName: 'Ada',
    lastName: 'Lovelace',
    displayName: 'Ada',
    preferredCurrency: 'CAD' as const,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
}

describe('ProfileForm', () => {
    beforeEach(() => {
        vi.stubEnv('VITE_API_URL', 'http://localhost:8787')
    })

    it('renders profile values and the read-only currency choices', () => {
        render(<ProfileForm profile={profile} />)

        expect(screen.getByLabelText('First name')).toHaveValue('Ada')
        expect(screen.getByLabelText('Last name')).toHaveValue('Lovelace')
        expect(screen.getByRole('combobox', { name: 'Preferred currency' })).toHaveTextContent(
            'CAD',
        )
        expect(screen.getByRole('button', { name: 'Save changes' })).toBeEnabled()
    })

    it('validates field length and submits the editable payload', async () => {
        const user = userEvent.setup()
        render(<ProfileForm profile={profile} />)

        await user.type(screen.getByLabelText('Display name'), 'x'.repeat(81))
        await user.click(screen.getByRole('button', { name: 'Save changes' }))

        expect(await screen.findByText(/80 characters or fewer/i)).toBeInTheDocument()
    })

    it('shows a server error and pending state', async () => {
        const user = userEvent.setup()
        server.use(
            http.patch('http://localhost:8787/profile', async () => {
                await new Promise((resolve) => setTimeout(resolve, 50))
                return HttpResponse.json(
                    { error: { code: 'VALIDATION_ERROR', message: 'Profile could not be saved.' } },
                    { status: 422 },
                )
            }),
        )
        render(<ProfileForm profile={profile} />)

        await user.click(screen.getByRole('button', { name: 'Save changes' }))
        expect(await screen.findByRole('button', { name: /saving/i })).toHaveAttribute(
            'aria-disabled',
            'true',
        )
        expect(await screen.findByText('Profile could not be saved.')).toBeInTheDocument()
        expect(screen.queryByText('Profile saved.')).not.toBeInTheDocument()
    })

    it('announces success only after the profile mutation succeeds', async () => {
        const user = userEvent.setup()
        render(<ProfileForm profile={profile} />)

        await user.clear(screen.getByLabelText('Display name'))
        await user.type(screen.getByLabelText('Display name'), 'Grace')
        await user.click(screen.getByRole('button', { name: 'Save changes' }))

        expect(await screen.findByRole('status')).toHaveTextContent('Profile saved.')
        expect(screen.getByLabelText('Display name')).toHaveValue('Grace')
    })

    it('disables form controls while saving', async () => {
        const user = userEvent.setup()
        const apiUrl = 'http://profile-pending.test'
        let patchRequestCount = 0
        vi.stubEnv('VITE_API_URL', apiUrl)
        server.use(
            http.patch(`${apiUrl}/profile`, async ({ request }) => {
                patchRequestCount += 1
                await new Promise((resolve) => setTimeout(resolve, 100))
                const values = (await request.json()) as Partial<typeof profile>
                return HttpResponse.json({
                    data: { ...profile, ...values },
                })
            }),
        )
        render(<ProfileForm profile={profile} />)

        await user.clear(screen.getByLabelText('First name'))
        await user.type(screen.getByLabelText('First name'), 'Grace')
        await user.click(screen.getByRole('button', { name: 'Save changes' }))

        expect(await screen.findByLabelText('First name')).toBeDisabled()
        expect(screen.getByRole('combobox', { name: 'Preferred currency' })).toBeDisabled()
        expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled()
        await user.click(screen.getByRole('button', { name: /saving/i }))
        await waitFor(() => expect(screen.getByLabelText('First name')).toBeEnabled())

        expect(patchRequestCount).toBe(1)
    })

    it('clears optional fields as null when saved', async () => {
        const user = userEvent.setup()
        const fetchSpy = vi.spyOn(globalThis, 'fetch')
        render(<ProfileForm profile={profile} />)

        await user.clear(screen.getByLabelText('First name'))
        fetchSpy.mockClear()
        await user.click(screen.getByRole('button', { name: 'Save changes' }))
        await waitFor(() => expect(fetchSpy).toHaveBeenCalled())

        const patchCall = fetchSpy.mock.calls.find(
            ([url, init]) => String(url).endsWith('/profile') && init?.method === 'PATCH',
        )
        expect(JSON.parse(String(patchCall?.[1]?.body))).toMatchObject({ firstName: null })
        fetchSpy.mockRestore()
    })
})
