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
        await expect(canvas.getByLabelText('Password')).toHaveAttribute('type', 'password')
        await expect(canvas.getByRole('button', { name: /show password/i })).toBeVisible()
    },
}

export const WithError: Story = {
    args: { error: 'Password is required' },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await expect(canvas.getByRole('alert')).toHaveTextContent('Password is required')
        await expect(canvas.getByLabelText('Password')).toHaveAttribute('aria-invalid', 'true')
    },
}

export const Disabled: Story = {
    args: { disabled: true },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await expect(canvas.getByLabelText('Password')).toBeDisabled()
    },
}

export const ShowHideToggle: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const input = canvas.getByLabelText('Password')
        await expect(input).toHaveAttribute('type', 'password')

        await userEvent.click(canvas.getByRole('button', { name: /show password/i }))
        await expect(input).toHaveAttribute('type', 'text')
        await expect(canvas.getByRole('button', { name: /hide password/i })).toBeVisible()

        await userEvent.click(canvas.getByRole('button', { name: /hide password/i }))
        await expect(input).toHaveAttribute('type', 'password')
    },
}
