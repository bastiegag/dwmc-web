import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { http, HttpResponse, delay } from 'msw'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm'

const meta: Meta<typeof ResetPasswordForm> = {
    title: 'Auth/ResetPasswordForm',
    component: ResetPasswordForm,
    decorators: [
        (Story) => (
            <QueryClientProvider
                client={
                    new QueryClient({
                        defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
                    })
                }
            >
                <MemoryRouter>
                    <div className="mx-auto max-w-md p-6">
                        <Story />
                    </div>
                </MemoryRouter>
            </QueryClientProvider>
        ),
    ],
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await expect(canvas.getByLabelText(/^new password$/i)).toBeVisible()
        await expect(canvas.getByLabelText(/confirm new password/i)).toBeVisible()
        await expect(canvas.getByRole('button', { name: /update password/i })).toBeEnabled()
    },
}

export const PasswordMismatch: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await userEvent.type(canvas.getByLabelText(/^new password$/i), 'Password123')
        await userEvent.type(canvas.getByLabelText(/confirm new password/i), 'Different123')
        await userEvent.click(canvas.getByRole('button', { name: /update password/i }))
        await expect(canvas.getByText('Passwords do not match')).toBeVisible()
    },
}

export const Loading: Story = {
    parameters: {
        msw: {
            handlers: [
                http.put(/\/auth\/v1\/user/, async () => {
                    await delay('infinite')
                    return HttpResponse.json({})
                }),
            ],
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await userEvent.type(canvas.getByLabelText(/^new password$/i), 'Password123')
        await userEvent.type(canvas.getByLabelText(/confirm new password/i), 'Password123')
        await userEvent.click(canvas.getByRole('button', { name: /update password/i }))
        await expect(
            await canvas.findByRole('button', { name: /updating password/i }),
        ).toBeDisabled()
    },
}

export const Success: Story = {
    parameters: {
        msw: {
            handlers: [
                http.put(/\/auth\/v1\/user/, () => HttpResponse.json({ id: 'mock-user-id' })),
            ],
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await userEvent.type(canvas.getByLabelText(/^new password$/i), 'Password123')
        await userEvent.type(canvas.getByLabelText(/confirm new password/i), 'Password123')
        await userEvent.click(canvas.getByRole('button', { name: /update password/i }))
        await expect(canvas.findByText(/password updated/i)).resolves.toBeVisible()
    },
}
