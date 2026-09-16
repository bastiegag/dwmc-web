import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { PasswordField } from '@/components/form/PasswordField'

const meta: Meta<typeof PasswordField> = {
    title: 'Form/PasswordField',
    component: PasswordField,
    tags: ['autodocs'],
    args: { id: 'password', label: 'Password' },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await expect(canvas.getByLabelText(/password/i)).toBeVisible()
        await expect(canvas.getByRole('button', { name: /show password/i })).toBeVisible()
    },
}

export const WithError: Story = {
    args: { error: 'Password is required' },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await expect(canvas.getByText('Password is required')).toBeVisible()
        await expect(canvas.getByLabelText(/password/i)).toHaveAttribute('aria-invalid', 'true')
    },
}

export const Disabled: Story = { args: { disabled: true } }

export const ToggleVisibility: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const input = canvas.getByLabelText(/password/i)
        await expect(input).toHaveAttribute('type', 'password')

        await userEvent.type(input, 'secret123')
        await userEvent.click(canvas.getByRole('button', { name: /show password/i }))
        await expect(input).toHaveAttribute('type', 'text')

        await userEvent.click(canvas.getByRole('button', { name: /hide password/i }))
        await expect(input).toHaveAttribute('type', 'password')
    },
}
