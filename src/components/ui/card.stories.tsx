import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card } from './card'

const meta = {
    title: 'Design System/Components/Surfaces/Card',
    component: Card,
    tags: ['autodocs'],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

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
