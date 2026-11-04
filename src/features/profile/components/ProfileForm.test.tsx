import { beforeEach, describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { screen, waitFor } from '@testing-library/react'
import { ProfileForm } from '../ProfileForm'
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
        expect(await screen.findByRole('button', { name: /saving/i })).toBeDisabled()
        expect(await screen.findByText('Profile could not be saved.')).toBeInTheDocument()
    })

    it('clears optional fields as null when saved', async () => {
        const user = userEvent.setup()
        const fetchSpy = vi.spyOn(globalThis, 'fetch')
        render(<ProfileForm profile={profile} />)

        await user.clear(screen.getByLabelText('First name'))
        await user.click(screen.getByRole('button', { name: 'Save changes' }))
        await waitFor(() => expect(fetchSpy).toHaveBeenCalled())

        const patchCall = fetchSpy.mock.calls.find(
            ([url, init]) => String(url).endsWith('/profile') && init?.method === 'PATCH',
        )
        expect(JSON.parse(String(patchCall?.[1]?.body))).toMatchObject({ firstName: null })
        fetchSpy.mockRestore()
    })
})
