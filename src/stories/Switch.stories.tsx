import type { Meta, StoryObj } from '@storybook/react-vite'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

const meta = {
    title: 'UI/Switch',
    component: Switch,
    tags: ['autodocs'],
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => (
        <div className="flex items-center gap-3">
            <Switch id="switch-default" />
            <Label htmlFor="switch-default">Monthly reminders</Label>
        </div>
    ),
}

export const Checked: Story = {
    render: () => (
        <div className="flex items-center gap-3">
            <Switch id="switch-checked" defaultChecked />
            <Label htmlFor="switch-checked">Sync enabled</Label>
        </div>
    ),
}

export const Disabled: Story = {
    render: () => (
        <div className="flex items-center gap-3">
            <Switch id="switch-disabled" disabled />
            <Label htmlFor="switch-disabled">Unavailable setting</Label>
        </div>
    ),
}
