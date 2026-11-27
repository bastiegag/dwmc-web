import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Field, FieldLabel } from '@/components/form'
import { Switch } from './Switch'

const meta = {
    title: 'Design System/Primitives/Forms/Switch',
    component: Switch,
    tags: ['autodocs'],
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

const NotificationsSwitch = (props: React.ComponentProps<typeof Switch>) => (
    <Field disabled={props.disabled} className="flex items-center gap-2 space-y-0">
        <Switch id="budget-notifications" {...props} />
        <FieldLabel htmlFor="budget-notifications">Enable budget notifications</FieldLabel>
    </Field>
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
            <Field className="flex items-center gap-2 space-y-0">
                <Switch
                    id="controlled-budget-notifications"
                    checked={checked}
                    onCheckedChange={setChecked}
                />
                <FieldLabel htmlFor="controlled-budget-notifications">
                    Budget notifications: {checked ? 'on' : 'off'}
                </FieldLabel>
            </Field>
        )
    },
}
