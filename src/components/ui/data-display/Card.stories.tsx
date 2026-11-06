import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card } from './Card'

const meta = {
    title: 'Design System/Components/Surfaces/Card',
    component: Card,
    tags: ['autodocs'],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const WithoutHeader: Story = {
    render: () => (
        <Card className="max-w-md">
            <p className="text-body-sm text-muted-foreground">
                Content-only card without a title or description.
            </p>
        </Card>
    ),
}

export const TransactionList: Story = {
    render: () => (
        <Card className="max-w-md" title="Recent transactions" description="Last 3 entries">
            <ul className="divide-y">
                {[
                    { name: 'Grocery store', amount: '-$84.20' },
                    { name: 'Salary deposit', amount: '+$2,400.00' },
                    { name: 'Utilities', amount: '-$136.75' },
                ].map((item) => (
                    <li key={item.name} className="flex justify-between py-2 text-sm">
                        <span>{item.name}</span>
                        <span className="tabular-nums">{item.amount}</span>
                    </li>
                ))}
            </ul>
        </Card>
    ),
}

export const Default: Story = {
    render: () => (
        <Card
            className="max-w-md"
            title="Everyday spending"
            description="Your current monthly budget progress."
        >
            <div className="flex items-baseline justify-between">
                <span className="text-3xl font-semibold">$420</span>
                <span className="text-sm text-muted-foreground">of $600</span>
            </div>
        </Card>
    ),
}
