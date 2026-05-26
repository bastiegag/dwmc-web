import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LoginForm } from '@/features/auth/components/LoginForm'

const meta: Meta<typeof LoginForm> = {
    title: 'Auth/LoginForm',
    component: LoginForm,
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
