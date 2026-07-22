import type { Meta, StoryObj } from '@storybook/react-vite'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { withCenteredLayout } from './decorators'

const meta: Meta<typeof Alert> = {
    title: 'UI/Alert',
    component: Alert,
    decorators: [withCenteredLayout],
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => (
        <Alert>
            <AlertTitle>Heads up</AlertTitle>
            <AlertDescription>This is the default alert state.</AlertDescription>
        </Alert>
    ),
}

export const Success: Story = {
    render: () => (
        <Alert variant="success">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>Something completed successfully.</AlertDescription>
        </Alert>
    ),
}

export const Warning: Story = {
    render: () => (
        <Alert variant="warning">
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>Something needs attention.</AlertDescription>
        </Alert>
    ),
}

export const Info: Story = {
    render: () => (
        <Alert variant="info">
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>This is contextual guidance.</AlertDescription>
        </Alert>
    ),
}

export const Destructive: Story = {
    render: () => (
        <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Something went wrong.</AlertDescription>
        </Alert>
    ),
}
