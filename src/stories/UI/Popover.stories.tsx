import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { withCenteredLayout } from '../decorators'

const meta = {
    title: 'UI/Popover',
    component: Popover,
    decorators: [withCenteredLayout],
    tags: ['autodocs'],
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline">Open details</Button>
            </PopoverTrigger>
            <PopoverContent>
                <div className="space-y-1">
                    <h3 className="font-medium">Budget details</h3>
                    <p className="text-sm text-muted-foreground">
                        Review the current month before making changes.
                    </p>
                </div>
            </PopoverContent>
        </Popover>
    ),
}
