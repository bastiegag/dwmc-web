import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const meta: Meta<typeof Card> = {
    title: 'UI/Card',
    component: Card,
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
    render: () => <Card className="max-w-sm p-6">Basic card surface</Card>,
}

export const WithHeader: Story = {
    render: () => (
        <Card className="max-w-sm">
            <CardHeader>
                <CardTitle>Card title</CardTitle>
                <CardDescription>Short description.</CardDescription>
            </CardHeader>
            <CardContent>Card content goes here.</CardContent>
        </Card>
    ),
}

export const WithFooter: Story = {
    render: () => (
        <Card className="max-w-sm">
            <CardHeader>
                <CardTitle>Footer example</CardTitle>
                <CardDescription>Useful for summary cards.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-sm text-muted-foreground">Main content</div>
                <div className="mt-4 border-t pt-4 text-xs text-muted-foreground">Footer text</div>
            </CardContent>
        </Card>
    ),
}
