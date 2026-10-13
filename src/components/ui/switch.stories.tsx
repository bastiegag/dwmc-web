import type { Meta, StoryObj } from '@storybook/react-vite'
import { Label } from './label'
import { Switch } from './switch'

const meta = {
    title: 'Design System/Components/Forms/Switch',
    component: Switch,
    tags: ['autodocs'],
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

const NotificationsSwitch = (props: React.ComponentProps<typeof Switch>) => (
    <div className="flex items-center gap-2">
        <Switch id="budget-notifications" {...props} />
        <Label htmlFor="budget-notifications">Enable budget notifications</Label>
    </div>
)

export const Default: Story = {
    render: () => <NotificationsSwitch />,
}

export const Checked: Story = {
    render: () => <NotificationsSwitch defaultChecked />,
}

export const Disabled: Story = {
    render: () => <NotificationsSwitch disabled />,
}
