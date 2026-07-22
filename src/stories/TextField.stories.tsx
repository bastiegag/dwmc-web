import type { Meta, StoryObj } from '@storybook/react-vite'
import { TextField } from '@/components/form/TextField'
import { withCenteredLayout } from './decorators'

const meta: Meta<typeof TextField> = {
    title: 'Forms/TextField',
    component: TextField,
    decorators: [withCenteredLayout],
    tags: ['autodocs'],
    args: {
        id: 'example-text-field',
        label: 'Email',
        placeholder: 'you@example.com',
    },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithError: Story = {
    args: {
        error: 'Email is required.',
    },
}

export const Disabled: Story = {
    args: {
        disabled: true,
    },
}
