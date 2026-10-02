import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './button'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

const meta = {
    title: 'UI/Overlays/Popover',
    component: Popover,
    tags: ['autodocs'],
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline">View budget details</Button>
            </PopoverTrigger>
            <PopoverContent>
                <p className="text-sm font-medium">Everyday spending</p>
                <p className="mt-1 text-sm text-muted-foreground">$180 remaining this month.</p>
            </PopoverContent>
        </Popover>
    ),
}
