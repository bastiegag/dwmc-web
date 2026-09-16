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

export const Composed: Story = {
    render: () => (
        <Card className="max-w-sm">
            <CardHeader>
                <CardTitle>Monthly summary</CardTitle>
                <CardDescription>September spending overview.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-semibold">$1,240.00</div>
                <div className="mt-2 text-sm text-muted-foreground">$320 below your budget</div>
            </CardContent>
        </Card>
    ),
}
