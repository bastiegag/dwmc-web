import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { http, HttpResponse, delay } from 'msw'
import { SignupForm } from '@/features/auth/components/SignupForm'
import { withCenteredLayout, withQueryClient, withRouter } from './decorators'

const meta: Meta<typeof SignupForm> = {
    title: 'Auth/SignupForm',
    component: SignupForm,
    decorators: [withQueryClient, withRouter, withCenteredLayout],
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await expect(canvas.getByLabelText(/email/i)).toBeVisible()
        await expect(canvas.getByLabelText(/^password/i)).toBeVisible()
        await expect(canvas.getByLabelText(/confirm password/i)).toBeVisible()
        await expect(canvas.getByRole('button', { name: /create account/i })).toBeEnabled()
        await expect(canvas.getByRole('link', { name: /sign in/i })).toBeVisible()
    },
}

export const EmptyValidation: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await userEvent.click(canvas.getByRole('button', { name: /create account/i }))
        await expect(canvas.getByText('Email is required')).toBeVisible()
        await expect(canvas.getByText('Password is required')).toBeVisible()
    },
}

export const PasswordMismatch: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await userEvent.type(canvas.getByLabelText(/email/i), 'new@example.com')
        await userEvent.type(canvas.getByLabelText(/^password/i), 'Password123')
        await userEvent.type(canvas.getByLabelText(/confirm password/i), 'Different123')
        await userEvent.click(canvas.getByRole('button', { name: /create account/i }))
        await expect(canvas.getByText('Passwords do not match')).toBeVisible()
    },
}

export const Loading: Story = {
    parameters: {
        msw: {
            handlers: [
                http.post(/\/auth\/v1\/signup/, async () => {
                    await delay('infinite')
                    return HttpResponse.json({})
                }),
            ],
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await userEvent.type(canvas.getByLabelText(/email/i), 'new@example.com')
        await userEvent.type(canvas.getByLabelText(/^password/i), 'Password123')
        await userEvent.type(canvas.getByLabelText(/confirm password/i), 'Password123')
        await userEvent.click(canvas.getByRole('button', { name: /create account/i }))
        await expect(
            await canvas.findByRole('button', { name: /creating account/i }),
        ).toBeDisabled()
    },
}

export const ServerError: Story = {
    parameters: {
        msw: {
            handlers: [
                http.post(/\/auth\/v1\/signup/, () =>
                    HttpResponse.json({ error: 'User already registered' }, { status: 422 }),
                ),
            ],
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await userEvent.type(canvas.getByLabelText(/email/i), 'existing@example.com')
        await userEvent.type(canvas.getByLabelText(/^password/i), 'Password123')
        await userEvent.type(canvas.getByLabelText(/confirm password/i), 'Password123')
        await userEvent.click(canvas.getByRole('button', { name: /create account/i }))
        await expect(await canvas.findByRole('alert')).toBeVisible()
    },
}
