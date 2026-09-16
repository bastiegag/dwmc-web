import type { Meta, StoryObj } from '@storybook/react-vite'
import { Progress } from '@/components/ui/progress'

const meta = {
    title: 'UI/Progress',
    component: Progress,
    tags: ['autodocs'],
    args: { 'aria-label': 'Budget progress' },
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { value: 50 } }

export const AllValues: Story = {
    render: () => (
        <div className="max-w-md space-y-4">
            {[0, 25, 50, 75, 100].map((value) => (
                <div className="space-y-1" key={value}>
                    <div className="flex justify-between text-sm">
                        <span>{value}% complete</span>
                        <span className="text-muted-foreground">Budget</span>
                    </div>
                    <Progress value={value} aria-label={`${value}% complete`} />
                </div>
            ))}
        </div>
    ),
}
