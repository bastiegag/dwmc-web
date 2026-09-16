import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { http, HttpResponse, delay } from 'msw'
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm'
import { withCenteredLayout, withQueryClient, withRouter } from './decorators'

const meta: Meta<typeof ForgotPasswordForm> = {
    title: 'Auth/ForgotPasswordForm',
    component: ForgotPasswordForm,
    decorators: [withQueryClient, withRouter, withCenteredLayout],
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await expect(canvas.getByLabelText(/email/i)).toBeVisible()
        await expect(canvas.getByRole('button', { name: /send reset link/i })).toBeEnabled()
        await expect(canvas.getByRole('link', { name: /back to sign in/i })).toBeVisible()
    },
}

export const ValidationError: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await userEvent.click(canvas.getByRole('button', { name: /send reset link/i }))
        await expect(canvas.getByText('Email is required')).toBeVisible()
    },
}

export const Loading: Story = {
    parameters: {
        msw: {
            handlers: [
                http.post(/\/auth\/v1\/recover/, async () => {
                    await delay('infinite')
                    return HttpResponse.json({})
                }),
            ],
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await userEvent.type(canvas.getByLabelText(/email/i), 'test@example.com')
        await userEvent.click(canvas.getByRole('button', { name: /send reset link/i }))
        await expect(
            await canvas.findByRole('button', { name: /sending reset link/i }),
        ).toBeDisabled()
    },
}

export const Success: Story = {
    parameters: {
        msw: {
            handlers: [http.post(/\/auth\/v1\/recover/, () => HttpResponse.json({}))],
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await userEvent.type(canvas.getByLabelText(/email/i), 'test@example.com')
        await userEvent.click(canvas.getByRole('button', { name: /send reset link/i }))
        await expect(canvas.findByText(/check your email/i)).resolves.toBeVisible()
    },
}

export const ServerError: Story = {
    parameters: {
        msw: {
            handlers: [
                http.post(/\/auth\/v1\/recover/, () =>
                    HttpResponse.json(
                        { error: 'Service temporarily unavailable' },
                        { status: 500 },
                    ),
                ),
            ],
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await userEvent.type(canvas.getByLabelText(/email/i), 'test@example.com')
        await userEvent.click(canvas.getByRole('button', { name: /send reset link/i }))
        await expect(await canvas.findByRole('alert')).toBeVisible()
    },
}
