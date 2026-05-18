import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { TextField } from '@/components/form/TextField'

const meta: Meta<typeof TextField> = {
    title: 'Form/TextField',
    component: TextField,
    tags: ['autodocs'],
    args: { id: 'field', label: 'Email' },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: { type: 'email', placeholder: 'you@example.com' },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await expect(canvas.getByLabelText('Email')).toBeVisible()
        await expect(canvas.getByLabelText('Email')).toBeEnabled()
    },
}

export const WithError: Story = {
    args: { error: 'Email is required' },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await expect(canvas.getByRole('alert')).toHaveTextContent('Email is required')
        await expect(canvas.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true')
    },
}

export const Disabled: Story = {
    args: { disabled: true },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await expect(canvas.getByLabelText('Email')).toBeDisabled()
    },
}

export const TypeInput: Story = {
    args: { type: 'email', placeholder: 'you@example.com' },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const input = canvas.getByLabelText('Email')
        await userEvent.type(input, 'user@example.com')
        await expect(input).toHaveValue('user@example.com')
    },
}
