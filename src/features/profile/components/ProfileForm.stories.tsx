import type { Meta, StoryObj } from '@storybook/react-vite'
import { delay, http, HttpResponse } from 'msw'
import { expect } from 'storybook/test'
import { ProfileForm } from './ProfileForm'
import type { UserProfile } from '@/features/profile/types/profile.types'
import { withAppProviders } from '../../../../.storybook/with-app-providers'

const profile: UserProfile = {
    id: 'profile-story',
    authUserId: 'storybook-user',
    firstName: 'Ada',
    lastName: 'Lovelace',
    displayName: 'Ada',
    preferredCurrency: 'CAD',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
}

const profileSuccessHandler = http.patch('*/profile', async ({ request }) => {
    const values = (await request.json()) as Partial<UserProfile>
    return HttpResponse.json({
        data: { ...profile, ...values, updatedAt: '2026-01-02T00:00:00.000Z' },
    })
})

const meta = {
    title: 'Design System/Product/Profile/Profile Form',
    component: ProfileForm,
    tags: ['autodocs'],
    decorators: [withAppProviders],
    args: { profile },
    parameters: { msw: { handlers: [profileSuccessHandler] } },
} satisfies Meta<typeof ProfileForm>

export default meta
type Story = StoryObj<typeof meta>

export const Populated: Story = { args: {} }

export const ValidationErrors: Story = {
    play: async ({ canvas, userEvent }) => {
        await userEvent.type(canvas.getByLabelText('Display name'), 'x'.repeat(81))
        await userEvent.click(canvas.getByRole('button', { name: 'Save changes' }))
        await expect(canvas.findByText(/80 characters or fewer/i)).resolves.toBeVisible()
    },
}

export const Pending: Story = {
    parameters: {
        msw: {
            handlers: [
                http.patch('*/profile', async () => {
                    await delay(5000)
                    return HttpResponse.json({ data: profile })
                }),
            ],
        },
    },
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole('button', { name: 'Save changes' }))
        await expect(canvas.findByRole('button', { name: /saving/i })).resolves.toBeDisabled()
    },
}

export const ServerError: Story = {
    parameters: {
        msw: {
            handlers: [
                http.patch('*/profile', () =>
                    HttpResponse.json(
                        {
                            error: {
                                code: 'VALIDATION_ERROR',
                                message: 'The profile could not be saved.',
                            },
                        },
                        { status: 422 },
                    ),
                ),
            ],
        },
    },
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole('button', { name: 'Save changes' }))
        await expect(canvas.findByRole('alert')).resolves.toHaveTextContent(
            'The profile could not be saved.',
        )
    },
}

export const SuccessFeedback: Story = {
    play: async ({ canvas, userEvent }) => {
        await userEvent.clear(canvas.getByLabelText('Display name'))
        await userEvent.type(canvas.getByLabelText('Display name'), 'Grace')
        await userEvent.click(canvas.getByRole('button', { name: 'Save changes' }))
        await expect(canvas.findByRole('status', {}, { timeout: 5000 })).resolves.toHaveTextContent(
            'Profile saved.',
        )
    },
}
