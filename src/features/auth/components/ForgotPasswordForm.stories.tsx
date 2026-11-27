import type { Meta, StoryObj } from '@storybook/react-vite'
import { delay, http, HttpResponse } from 'msw'
import { expect } from 'storybook/test'
import { withAppProviders } from '../../../../.storybook/with-app-providers'
import { ForgotPasswordForm } from './ForgotPasswordForm'

const meta = {
    title: 'Design System/Product/Authentication/Forgot Password Form',
    component: ForgotPasswordForm,
    tags: ['autodocs'],
    decorators: [withAppProviders],
} satisfies Meta<typeof ForgotPasswordForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const ValidationErrors: Story = {
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole('button', { name: 'Send reset link' }))
        await expect(canvas.findByText('Email is required')).resolves.toBeVisible()
    },
}

export const Pending: Story = {
    parameters: {
        msw: {
            handlers: [
                http.post('*/auth/v1/recover*', async () => {
                    await delay(5000)
                    return HttpResponse.json({})
                }),
            ],
        },
    },
    play: async ({ canvas, userEvent }) => {
        await userEvent.type(canvas.getByLabelText(/^Email/), 'person@example.com')
        await userEvent.click(canvas.getByRole('button', { name: 'Send reset link' }))
        await expect(
            canvas.findByRole('button', { name: /sending reset link/i }),
        ).resolves.toHaveAttribute('aria-disabled', 'true')
    },
}

export const ServerError: Story = {
    parameters: {
        msw: {
            handlers: [
                http.post('*/auth/v1/recover*', () =>
                    HttpResponse.json(
                        {
                            error: 'server_error',
                            error_description: 'Password recovery is temporarily unavailable.',
                        },
                        { status: 500 },
                    ),
                ),
            ],
        },
    },
    play: async ({ canvas, userEvent }) => {
        await userEvent.type(canvas.getByLabelText(/^Email/), 'person@example.com')
        await userEvent.click(canvas.getByRole('button', { name: 'Send reset link' }))
        await expect(canvas.findByRole('alert')).resolves.toHaveTextContent(
            'We could not send a password reset link. Please try again.',
        )
    },
}

export const SuccessFeedback: Story = {
    parameters: {
        msw: { handlers: [http.post('*/auth/v1/recover*', () => HttpResponse.json({}))] },
    },
    play: async ({ canvas, userEvent }) => {
        await userEvent.type(canvas.getByLabelText(/^Email/), 'person@example.com')
        await userEvent.click(canvas.getByRole('button', { name: 'Send reset link' }))
        await canvas.findByText('Reset link sent')
        await expect(canvas.getByRole('region', { name: /notifications/i })).toHaveTextContent(
            'Reset link sent',
        )
    },
}
