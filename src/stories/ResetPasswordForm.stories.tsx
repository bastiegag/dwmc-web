import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
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
        await expect(canvas.getByLabelText(/^new password/i)).toBeVisible()
        await expect(canvas.getByLabelText(/confirm new password/i)).toBeVisible()
        await expect(canvas.getByRole('button', { name: /update password/i })).toBeEnabled()
    },
}

export const EmptyValidation: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await userEvent.click(canvas.getByRole('button', { name: /update password/i }))
        await expect(canvas.getByText('Password must be at least 8 characters')).toBeVisible()
    },
}

export const PasswordMismatch: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await userEvent.type(canvas.getByLabelText(/^new password/i), 'Password123')
        await userEvent.type(canvas.getByLabelText(/confirm new password/i), 'Password456')
        await userEvent.click(canvas.getByRole('button', { name: /update password/i }))
        await expect(canvas.getByText('Passwords do not match')).toBeVisible()
    },
}
