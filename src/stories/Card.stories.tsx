import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const meta: Meta<typeof Card> = {
    title: 'UI/Card',
    component: Card,
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => (
        <Card className="w-80">
            <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card description goes here.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Card content goes here.</p>
            </CardContent>
        </Card>
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await expect(canvas.getByText('Card Title')).toBeVisible()
        await expect(canvas.getByText('Card description goes here.')).toBeVisible()
        await expect(canvas.getByText('Card content goes here.')).toBeVisible()
    },
}

export const WithFooter: Story = {
    render: () => (
        <Card className="w-80">
            <CardHeader>
                <CardTitle>Confirm action</CardTitle>
                <CardDescription>This action cannot be undone.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Are you sure you want to continue?</p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button variant="destructive">Delete</Button>
            </CardFooter>
        </Card>
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await expect(canvas.getByRole('button', { name: 'Cancel' })).toBeEnabled()
        await expect(canvas.getByRole('button', { name: 'Delete' })).toBeEnabled()
    },
}
