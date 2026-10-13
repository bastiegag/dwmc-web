import type { Meta, StoryObj } from '@storybook/react-vite'
import { TextField } from './TextField'

const meta = {
    title: 'Design System/Components/Forms/Text Field',
    component: TextField,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'A labeled text input that connects its error state to assistive technology. Use it for concise single-line form values.',
            },
        },
    },
    argTypes: {
        type: { control: 'select', options: ['text', 'email', 'number', 'password'] },
        required: { control: 'boolean' },
        disabled: { control: 'boolean' },
        error: { control: 'text' },
    },
} satisfies Meta<typeof TextField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: { id: 'account-name', label: 'Account name', placeholder: 'Chequing' },
}

export const Required: Story = {
    args: {
        id: 'email',
        label: 'Email',
        type: 'email',
        required: true,
        placeholder: 'you@example.com',
    },
}

export const Invalid: Story = {
    args: {
        id: 'amount',
        label: 'Amount',
        defaultValue: '-5',
        error: 'Enter an amount greater than zero.',
    },
}

export const Disabled: Story = {
    args: { id: 'account-type', label: 'Account type', defaultValue: 'Chequing', disabled: true },
}
