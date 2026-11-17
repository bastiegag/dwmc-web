import type { Meta, StoryObj } from '@storybook/react-vite'
import { delay, http, HttpResponse } from 'msw'
import { expect } from 'storybook/test'
import { withAppProviders } from '../../../../.storybook/with-app-providers'
import { SignupForm } from './SignupForm'

const user = {
    id: 'storybook-user',
    email: 'person@example.com',
    app_metadata: { provider: 'email', providers: ['email'] },
    user_metadata: {},
    aud: 'authenticated',
    created_at: '2026-01-01T00:00:00.000Z',
    identities: [],
}

const meta = {
    title: 'Design System/Product/Authentication/Signup Form',
    component: SignupForm,
    tags: ['autodocs'],
    decorators: [withAppProviders],
} satisfies Meta<typeof SignupForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const ValidationErrors: Story = {
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole('button', { name: 'Create account' }))
        await expect(canvas.findByText('Email is required')).resolves.toBeVisible()
    },
}

export const Pending: Story = {
    parameters: {
        msw: {
            handlers: [
                http.post('*/auth/v1/signup*', async () => {
                    await delay(5000)
                    return HttpResponse.json(user)
                }),
            ],
        },
    },
    play: async ({ canvas, userEvent }) => {
        await userEvent.type(canvas.getByLabelText(/^Email/), 'person@example.com')
        await userEvent.type(canvas.getByLabelText(/^Password/), 'Password123')
        await userEvent.type(canvas.getByLabelText(/^Confirm Password/), 'Password123')
        await userEvent.click(canvas.getByRole('button', { name: 'Create account' }))
        await expect(
            canvas.findByRole('button', { name: /creating account/i }),
        ).resolves.toHaveAttribute('aria-disabled', 'true')
    },
}

export const ServerError: Story = {
    parameters: {
        msw: {
            handlers: [
                http.post('*/auth/v1/signup*', () =>
                    HttpResponse.json(
                        {
                            error: 'invalid_request',
                            error_description: 'This email is already registered.',
                        },
                        { status: 422 },
                    ),
                ),
            ],
        },
    },
    play: async ({ canvas, userEvent }) => {
        await userEvent.type(canvas.getByLabelText(/^Email/), 'person@example.com')
        await userEvent.type(canvas.getByLabelText(/^Password/), 'Password123')
        await userEvent.type(canvas.getByLabelText(/^Confirm Password/), 'Password123')
        await userEvent.click(canvas.getByRole('button', { name: 'Create account' }))
        await expect(canvas.findByRole('alert')).resolves.toHaveTextContent(
            'An account with this email already exists.',
        )
    },
}

export const SuccessFeedback: Story = {
    parameters: {
        msw: { handlers: [http.post('*/auth/v1/signup*', () => HttpResponse.json(user))] },
    },
    play: async ({ canvas, userEvent }) => {
        await userEvent.type(canvas.getByLabelText(/^Email/), 'person@example.com')
        await userEvent.type(canvas.getByLabelText(/^Password/), 'Password123')
        await userEvent.type(canvas.getByLabelText(/^Confirm Password/), 'Password123')
        await userEvent.click(canvas.getByRole('button', { name: 'Create account' }))
        await expect(canvas.findByRole('status')).resolves.toHaveTextContent(
            'Please check your email to verify your account.',
        )
    },
}
