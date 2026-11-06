import type { Meta, StoryObj } from '@storybook/react-vite'
import { InputGroup, InputGroupAddon, InputGroupButton } from './InputGroup'
import { Input } from './Input'
const meta = {
    title: 'Design System/Components/Forms/Input Group',
    component: InputGroup,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component:
                    'Joins an input with addons such as currency symbols or action buttons. Place the `Input` inside the group and give it an accessible name with `aria-label` or an associated label.',
            },
        },
    },
} satisfies Meta<typeof InputGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Currency: Story = {
    render: () => (
        <InputGroup className="w-72">
            <InputGroupAddon>$</InputGroupAddon>
            <Input aria-label="Amount" placeholder="0.00" />
            <InputGroupAddon>CAD</InputGroupAddon>
        </InputGroup>
    ),
}

export const WithButton: Story = {
    render: () => (
        <InputGroup className="w-72">
            <Input aria-label="Search transactions" placeholder="Search transactions" />
            <InputGroupButton>Search</InputGroupButton>
        </InputGroup>
    ),
}

export const Disabled: Story = {
    render: () => (
        <InputGroup className="w-72">
            <InputGroupAddon>$</InputGroupAddon>
            <Input aria-label="Amount" placeholder="0.00" disabled />
        </InputGroup>
    ),
}
