import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from './Input'

const meta = {
    title: 'Design System/Components/Forms/Input',
    component: Input,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'Accepts single-line text input with native HTML input types, placeholders, values, and native disabled, read-only, and invalid (`aria-invalid`) states. Invalid styling is not built in; compose with Field for labels and error messages.',
            },
        },
    },
    argTypes: {
        type: {
            control: 'select',
            options: ['text', 'email', 'number', 'password', 'search', 'tel', 'url'],
        },
        placeholder: { control: 'text' },
        defaultValue: { control: 'text' },
        disabled: { control: 'boolean' },
    },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        defaultValue: '',
        placeholder: 'Placeholder...',
    },
    render: (args) => <Input {...args} />,
}

export const Disabled: Story = {
    args: {
        defaultValue: 'Disabled',
        disabled: true,
    },
    render: (args) => <Input {...args} />,
}

export const ReadOnly: Story = {
    args: {
        defaultValue: 'Read-only value',
        readOnly: true,
    },
    render: (args) => <Input aria-label="Account number" {...args} />,
}

export const Invalid: Story = {
    render: () => (
        <div className="flex w-72 flex-col gap-2">
            <label htmlFor="input-invalid-amount" className="text-sm font-medium">
                Amount
            </label>
            <Input
                id="input-invalid-amount"
                defaultValue="12.345"
                aria-invalid="true"
                aria-describedby="input-invalid-amount-error"
            />
            <p id="input-invalid-amount-error" className="text-sm text-destructive">
                Enter an amount with at most two decimal places.
            </p>
        </div>
    ),
}

export const States: Story = {
    render: () => (
        <div className="flex w-72 flex-col gap-4">
            <Input aria-label="Default state" placeholder="Default" />
            <Input aria-label="Filled state" defaultValue="Filled" />
            <Input aria-label="Read-only state" defaultValue="Read-only" readOnly />
            <Input aria-label="Disabled state" defaultValue="Disabled" disabled />
            <Input aria-label="Invalid state" defaultValue="Invalid" aria-invalid="true" />
        </div>
    ),
}
