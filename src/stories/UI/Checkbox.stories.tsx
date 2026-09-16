import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

const meta = {
    title: 'UI/Checkbox',
    component: Checkbox,
    tags: ['autodocs'],
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => (
        <div className="flex items-center gap-2">
            <Checkbox id="checkbox-default" />
            <Label htmlFor="checkbox-default">Include transfers</Label>
        </div>
    ),
}

export const Checked: Story = {
    render: () => (
        <div className="flex items-center gap-2">
            <Checkbox id="checkbox-checked" defaultChecked />
            <Label htmlFor="checkbox-checked">Include archived items</Label>
        </div>
    ),
}

export const Disabled: Story = {
    render: () => (
        <div className="flex items-center gap-2">
            <Checkbox id="checkbox-disabled" disabled />
            <Label htmlFor="checkbox-disabled">Unavailable option</Label>
        </div>
    ),
}
