import type { Meta, StoryObj } from '@storybook/react-vite'
import { delay, http, HttpResponse } from 'msw'
import { expect } from 'storybook/test'
import { withAppProviders } from '../../../../.storybook/with-app-providers'
import { LoginForm } from './LoginForm'

const session = {
    access_token: 'storybook-access-token',
    token_type: 'bearer',
    expires_in: 3600,
    refresh_token: 'storybook-refresh-token',
    user: {
        id: 'storybook-user',
        email: 'person@example.com',
        aud: 'authenticated',
        created_at: '2026-01-01T00:00:00.000Z',
    },
}

const meta = {
    title: 'Design System/Product/Authentication/Login Form',
    component: LoginForm,
    tags: ['autodocs'],
    decorators: [withAppProviders],
} satisfies Meta<typeof LoginForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const ValidationErrors: Story = {
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole('button', { name: 'Sign in' }))
        await expect(canvas.findByText('Email is required')).resolves.toBeVisible()
        await expect(canvas.findByText('Password is required')).resolves.toBeVisible()
    },
}

export const Pending: Story = {
    parameters: {
        msw: {
            handlers: [
                http.post('*/auth/v1/token*', async () => {
                    await delay(5000)
                    return HttpResponse.json(session)
                }),
            ],
        },
    },
    play: async ({ canvas, userEvent }) => {
        await userEvent.type(canvas.getByLabelText(/^Email/), 'person@example.com')
        await userEvent.type(canvas.getByLabelText(/^Password/), 'Password123')
        await userEvent.click(canvas.getByRole('button', { name: 'Sign in' }))
        await expect(canvas.findByRole('button', { name: /signing in/i })).resolves.toHaveAttribute(
            'aria-disabled',
            'true',
        )
    },
}

export const ServerError: Story = {
    parameters: {
        msw: {
            handlers: [
                http.post('*/auth/v1/token*', () =>
                    HttpResponse.json(
                        {
                            error: 'invalid_grant',
                            error_description: 'Invalid login credentials',
                        },
                        { status: 400 },
                    ),
                ),
            ],
        },
    },
    play: async ({ canvas, userEvent }) => {
        await userEvent.type(canvas.getByLabelText(/^Email/), 'person@example.com')
        await userEvent.type(canvas.getByLabelText(/^Password/), 'Password123')
        await userEvent.click(canvas.getByRole('button', { name: 'Sign in' }))
        await expect(canvas.findByRole('alert')).resolves.toHaveTextContent(
            /email or password is incorrect/i,
        )
    },
}
