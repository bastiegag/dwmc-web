import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { PasswordField } from './PasswordField'

const meta = {
    title: 'Design System/Form Fields/Password Field',
    component: PasswordField,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'A ready-to-use password field with an associated label, optional description and validation message, and an accessible visibility toggle.',
            },
        },
    },
    args: { id: 'password', label: 'Password' },
} satisfies Meta<typeof PasswordField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const DescriptionAndRequired: Story = {
    args: {
        description: 'Use at least 12 characters.',
        required: true,
        autoComplete: 'new-password',
    },
}

export const Invalid: Story = {
    args: {
        error: 'Password must be at least 12 characters.',
        defaultValue: 'short',
    },
}

export const Disabled: Story = {
    args: { disabled: true, defaultValue: 'secure-password' },
}

export const VisibilityToggle: Story = {
    play: async ({ canvas, userEvent }) => {
        const password = canvas.getByLabelText('Password')
        await expect(password).toHaveAttribute('type', 'password')
        await userEvent.click(canvas.getByRole('button', { name: 'Show password' }))
        await expect(password).toHaveAttribute('type', 'text')
        await expect(canvas.getByRole('button', { name: 'Hide password' })).toHaveAttribute(
            'aria-pressed',
            'true',
        )
    },
}
