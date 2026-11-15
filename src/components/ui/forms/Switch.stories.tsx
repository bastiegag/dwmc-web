import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Label } from './Label'
import { Switch } from './Switch'

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

export const Controlled: Story = {
    render: function ControlledSwitch() {
        const [checked, setChecked] = useState(false)

        return (
            <div className="flex items-center gap-2">
                <Switch
                    id="controlled-budget-notifications"
                    checked={checked}
                    onCheckedChange={setChecked}
                />
                <Label htmlFor="controlled-budget-notifications">
                    Budget notifications: {checked ? 'on' : 'off'}
                </Label>
            </div>
        )
    },
}
