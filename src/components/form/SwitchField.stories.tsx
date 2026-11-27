import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Controller, useForm } from 'react-hook-form'
import { Button } from '@/components/ui'
import { SwitchField } from './SwitchField'

const meta = {
    title: 'Design System/Composed Fields/SwitchField',
    component: SwitchField,
    tags: ['autodocs'],
    args: { id: 'notifications', label: 'Enable budget notifications' },
} satisfies Meta<typeof SwitchField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const DescriptionAndRequired: Story = {
    args: {
        description: 'Receive a reminder when a budget is close to its limit.',
        required: true,
    },
}

export const Disabled: Story = {
    args: { disabled: true, defaultChecked: true },
}

export const Invalid: Story = {
    args: { error: 'Choose whether budget notifications are enabled.' },
}

export const Controlled: Story = {
    render: function ControlledSwitch() {
        const [checked, setChecked] = useState(false)
        return (
            <SwitchField
                id="controlled-notifications"
                label={`Budget notifications: ${checked ? 'on' : 'off'}`}
                checked={checked}
                onCheckedChange={setChecked}
            />
        )
    },
}

export const ReactHookForm: Story = {
    render: function SwitchRHF() {
        const { control, handleSubmit } = useForm({ defaultValues: { enabled: false } })
        const [submitted, setSubmitted] = useState(false)

        return (
            <form
                noValidate
                className="grid gap-4"
                onSubmit={handleSubmit(() => setSubmitted(true))}
            >
                <Controller
                    name="enabled"
                    control={control}
                    render={({ field }) => (
                        <SwitchField
                            id="rhf-notifications"
                            label="Enable budget notifications"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            onBlur={field.onBlur}
                            ref={field.ref}
                        />
                    )}
                />
                <Button type="submit">Save preference</Button>
                {submitted && <p role="status">Preference saved.</p>}
            </form>
        )
    },
}
