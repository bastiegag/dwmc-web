import type { Meta, StoryObj } from '@storybook/react-vite'
import { CircleCheck, Info as InfoIcon, TriangleAlert } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from './alert'

const meta = {
    title: 'UI/Feedback/Alert',
    component: Alert,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'destructive', 'success', 'warning', 'info'],
        },
    },
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: (args) => (
        <Alert {...args}>
            <AlertTitle>Monthly budget updated</AlertTitle>
            <AlertDescription>Your Everyday spending budget is ready to review.</AlertDescription>
        </Alert>
    ),
}

export const Success: Story = {
    args: { variant: 'success' },
    render: (args) => (
        <Alert {...args}>
            <CircleCheck aria-hidden="true" />
            <AlertTitle>Transaction saved</AlertTitle>
            <AlertDescription>The grocery transaction was added successfully.</AlertDescription>
        </Alert>
    ),
}

export const Warning: Story = {
    args: { variant: 'warning' },
    render: (args) => (
        <Alert {...args}>
            <TriangleAlert aria-hidden="true" />
            <AlertTitle>Budget nearly reached</AlertTitle>
            <AlertDescription>You have used 85% of this month&apos;s budget.</AlertDescription>
        </Alert>
    ),
}

export const Info: Story = {
    args: { variant: 'info' },
    render: (args) => (
        <Alert {...args}>
            <InfoIcon aria-hidden="true" />
            <AlertTitle>New month available</AlertTitle>
            <AlertDescription>
                Review your recurring categories before adding entries.
            </AlertDescription>
        </Alert>
    ),
}

export const Destructive: Story = {
    args: { variant: 'destructive' },
    render: (args) => (
        <Alert {...args}>
            <AlertTitle>Could not save changes</AlertTitle>
            <AlertDescription>Check your connection and try again.</AlertDescription>
        </Alert>
    ),
}
