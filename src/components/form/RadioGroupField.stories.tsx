import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Controller, useForm } from 'react-hook-form'
import { Button } from '@/components/ui'
import { RadioGroupField } from './RadioGroupField'

const periods = [
    { value: 'monthly', label: 'Monthly budget' },
    { value: 'yearly', label: 'Yearly budget' },
    { value: 'custom', label: 'Custom period' },
]

const meta = {
    title: 'Design System/Form Fields/Radio Group Field',
    component: RadioGroupField,
    tags: ['autodocs'],
    args: { id: 'period', label: 'Budget period', options: periods },
} satisfies Meta<typeof RadioGroupField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: { defaultValue: 'monthly' },
}

export const Horizontal: Story = {
    args: { orientation: 'horizontal', defaultValue: 'monthly' },
}

export const DescriptionAndRequired: Story = {
    args: {
        description: 'Choose how often this budget repeats.',
        required: true,
    },
}

export const Disabled: Story = {
    args: { disabled: true, defaultValue: 'monthly' },
}

export const Invalid: Story = {
    args: { error: 'Choose a budget period.' },
}

export const Controlled: Story = {
    render: function ControlledRadioGroup() {
        const [value, setValue] = useState('monthly')
        return (
            <RadioGroupField
                id="controlled-period"
                label="Budget period"
                options={periods}
                value={value}
                onValueChange={setValue}
                orientation="horizontal"
            />
        )
    },
}

export const ReactHookForm: Story = {
    render: function RadioRHF() {
        const { control, handleSubmit } = useForm({ defaultValues: { period: 'monthly' } })
        const [submitted, setSubmitted] = useState(false)

        return (
            <form
                noValidate
                className="grid gap-4"
                onSubmit={handleSubmit(() => setSubmitted(true))}
            >
                <Controller
                    name="period"
                    control={control}
                    render={({ field }) => (
                        <RadioGroupField
                            id="rhf-period"
                            label="Budget period"
                            options={periods}
                            value={field.value}
                            onValueChange={field.onChange}
                            onBlur={field.onBlur}
                            ref={field.ref}
                        />
                    )}
                />
                <Button type="submit">Continue</Button>
                {submitted && <p role="status">Budget period saved.</p>}
            </form>
        )
    },
}
