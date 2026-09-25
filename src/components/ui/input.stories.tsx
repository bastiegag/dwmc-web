import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from '@/components/ui/input'

const meta = {
    title: 'UI/Forms/Input',
    component: Input,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'Accepts single-line text input with native HTML input types, placeholders, values, disabled states, and validation styling.',
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
