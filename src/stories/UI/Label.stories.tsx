import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const meta = {
    title: 'UI/Label',
    component: Label,
    tags: ['autodocs'],
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => (
        <div className="max-w-sm space-y-2">
            <Label htmlFor="label-default">Account name</Label>
            <Input id="label-default" placeholder="Everyday spending" />
        </div>
    ),
}

export const WithDisabledPeer: Story = {
    render: () => (
        <div className="max-w-sm space-y-2">
            <Label htmlFor="label-disabled">Archived account</Label>
            <Input id="label-disabled" disabled placeholder="Read only" />
        </div>
    ),
}
