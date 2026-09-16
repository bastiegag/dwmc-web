import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { http, HttpResponse, delay } from 'msw'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { withCenteredLayout, withQueryClient, withRouter } from './decorators'

const meta: Meta<typeof LoginForm> = {
    title: 'Auth/LoginForm',
    component: LoginForm,
    decorators: [withQueryClient, withRouter, withCenteredLayout],
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await expect(canvas.getByLabelText(/email/i)).toBeVisible()
        await expect(canvas.getByLabelText(/password/i)).toBeVisible()
        await expect(canvas.getByRole('button', { name: /sign in/i })).toBeEnabled()
        await expect(canvas.getByRole('link', { name: /forgot your password/i })).toBeVisible()
        await expect(canvas.getByRole('link', { name: /sign up/i })).toBeVisible()
    },
}

export const EmptyValidation: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await userEvent.click(canvas.getByRole('button', { name: /sign in/i }))
        await expect(canvas.getByText('Email is required')).toBeVisible()
        await expect(canvas.getByText('Password is required')).toBeVisible()
    },
}

export const InvalidEmailFormat: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await userEvent.type(canvas.getByLabelText(/email/i), 'not-an-email')
        await userEvent.click(canvas.getByRole('button', { name: /sign in/i }))
        await expect(canvas.getByText('Please enter a valid email address')).toBeVisible()
    },
}

export const Loading: Story = {
    parameters: {
        msw: {
            handlers: [
                http.post(/\/auth\/v1\/token/, async () => {
                    await delay('infinite')
                    return HttpResponse.json({})
                }),
            ],
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await userEvent.type(canvas.getByLabelText(/email/i), 'test@example.com')
        await userEvent.type(canvas.getByLabelText(/password/i), 'Password123')
        await userEvent.click(canvas.getByRole('button', { name: /sign in/i }))
        await expect(await canvas.findByRole('button', { name: /signing in/i })).toBeDisabled()
    },
}

export const ServerError: Story = {
    parameters: {
        msw: {
            handlers: [
                http.post(/\/auth\/v1\/token/, () =>
                    HttpResponse.json(
                        { error: 'invalid_grant', error_description: 'Invalid login credentials' },
                        { status: 400 },
                    ),
                ),
            ],
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await userEvent.type(canvas.getByLabelText(/email/i), 'test@example.com')
        await userEvent.type(canvas.getByLabelText(/password/i), 'Password123')
        await userEvent.click(canvas.getByRole('button', { name: /sign in/i }))
        await expect(await canvas.findByRole('alert')).toBeVisible()
    },
}
