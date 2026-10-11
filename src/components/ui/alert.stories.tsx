import type { Meta, StoryObj } from '@storybook/react-vite'
import { Alert } from './alert'

const meta = {
    title: 'Design System/Components/Feedback/Alert',
    component: Alert,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['info', 'success', 'warning', 'destructive'],
        },
    },
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: { variant: 'info' },
    render: (args) => (
        <Alert
            {...args}
            title="Monthly budget updated"
            description="Your Everyday spending budget is ready to review."
        />
    ),
}

export const Success: Story = {
    args: { variant: 'success' },
    render: (args) => (
        <Alert
            {...args}
            title="Transaction saved"
            description="The grocery transaction was added successfully."
        />
    ),
}

export const Warning: Story = {
    args: { variant: 'warning' },
    render: (args) => (
        <Alert
            {...args}
            title="Budget nearly reached"
            description="You have used 85% of this month's budget."
        />
    ),
}

export const Info: Story = {
    args: { variant: 'info' },
    render: (args) => (
        <Alert
            {...args}
            title="New month available"
            description="Review your recurring categories before adding entries."
        />
    ),
}

export const Destructive: Story = {
    args: { variant: 'destructive' },
    render: (args) => (
        <Alert
            {...args}
            title="Could not save changes"
            description="Check your connection and try again."
        />
    ),
}

export const WithAction: Story = {
    args: {
        variant: 'warning',
        title: 'Budget nearly reached',
        description: 'Review your spending before the end of the month.',
        action: { label: 'Review budget', onClick: () => undefined },
    },
}

export const WithSecondaryAction: Story = {
    args: {
        variant: 'info',
        title: 'New month available',
        description: 'Review your recurring categories before adding entries.',
        secondaryAction: { label: 'Later', onClick: () => undefined },
        action: { label: 'Review now', onClick: () => undefined },
    },
}
