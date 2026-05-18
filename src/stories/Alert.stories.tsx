import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { AlertCircle, CheckCircle } from 'lucide-react'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

const meta: Meta<typeof Alert> = {
    title: 'UI/Alert',
    component: Alert,
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => (
        <Alert>
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>You can add components using the cli.</AlertDescription>
        </Alert>
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await expect(canvas.getByRole('alert')).toBeVisible()
        await expect(canvas.getByText('Heads up!')).toBeVisible()
    },
}

export const Destructive: Story = {
    render: () => (
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" aria-hidden="true" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
        </Alert>
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await expect(canvas.getByRole('alert')).toBeVisible()
        await expect(
            canvas.getByText('Your session has expired. Please log in again.'),
        ).toBeVisible()
    },
}

export const WithIcon: Story = {
    render: () => (
        <Alert>
            <CheckCircle className="h-4 w-4" aria-hidden="true" />
            <AlertDescription>Operation completed successfully.</AlertDescription>
        </Alert>
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await expect(canvas.getByText('Operation completed successfully.')).toBeVisible()
    },
}
