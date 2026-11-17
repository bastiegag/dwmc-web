import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { withAppProviders } from '../../../../.storybook/with-app-providers'
import { ResetPasswordForm } from './ResetPasswordForm'

const meta = {
    title: 'Design System/Product/Authentication/Reset Password Form',
    component: ResetPasswordForm,
    tags: ['autodocs'],
    decorators: [withAppProviders],
} satisfies Meta<typeof ResetPasswordForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const ValidationErrors: Story = {
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole('button', { name: 'Update password' }))
        await expect(canvas.findByText(/at least 8 characters/i)).resolves.toBeVisible()
        await expect(canvas.findByText('Please confirm your password')).resolves.toBeVisible()
    },
}
