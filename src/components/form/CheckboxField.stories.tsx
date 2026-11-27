import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Controller, useForm } from 'react-hook-form'
import { Button } from '@/components/ui'
import { CheckboxField } from './CheckboxField'

const meta = {
    title: 'Design System/Form Fields/Checkbox Field',
    component: CheckboxField,
    tags: ['autodocs'],
    args: { id: 'terms', label: 'Accept the terms of service' },
} satisfies Meta<typeof CheckboxField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const DescriptionAndRequired: Story = {
    args: {
        description: 'Required before you can create an account.',
        required: true,
    },
}

export const Disabled: Story = {
    args: { disabled: true, defaultChecked: true },
}

export const Invalid: Story = {
    args: { error: 'You must accept the terms.' },
}

export const Controlled: Story = {
    render: function ControlledCheckbox() {
        const [checked, setChecked] = useState(false)

        return (
            <CheckboxField
                id="controlled-terms"
                label="Accept the terms of service"
                checked={checked}
                onCheckedChange={(nextChecked) => setChecked(nextChecked === true)}
            />
        )
    },
}

export const ReactHookForm: Story = {
    render: function CheckboxRHF() {
        const { control, handleSubmit } = useForm({ defaultValues: { accepted: false } })
        const [submitted, setSubmitted] = useState(false)

        return (
            <form
                noValidate
                className="grid gap-4"
                onSubmit={handleSubmit(() => setSubmitted(true))}
            >
                <Controller
                    name="accepted"
                    control={control}
                    render={({ field }) => (
                        <CheckboxField
                            id="rhf-terms"
                            label="Accept the terms of service"
                            required
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            onBlur={field.onBlur}
                            ref={field.ref}
                        />
                    )}
                />
                <Button type="submit">Continue</Button>
                {submitted && <p role="status">Terms accepted.</p>}
            </form>
        )
    },
}
