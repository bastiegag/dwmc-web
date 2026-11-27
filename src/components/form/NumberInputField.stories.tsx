import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Controller, useForm } from 'react-hook-form'
import { Button } from '@/components/ui'
import { NumberInputField } from './NumberInputField'

const meta = {
    title: 'Design System/Form Fields/Number Input Field',
    component: NumberInputField,
    tags: ['autodocs'],
    args: { id: 'quantity', label: 'Quantity', min: 0, max: 10 },
} satisfies Meta<typeof NumberInputField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: { defaultValue: 2 },
}

export const DescriptionAndRequired: Story = {
    args: {
        description: 'Choose a whole number from zero to ten.',
        required: true,
        defaultValue: 2,
    },
}

export const FractionalStep: Story = {
    args: {
        id: 'hours',
        label: 'Hours',
        description: 'Increase or decrease by half an hour.',
        defaultValue: 1,
        max: 8,
        step: 0.5,
    },
}

export const Disabled: Story = {
    args: { disabled: true, defaultValue: 4 },
}

export const Invalid: Story = {
    args: { error: 'Enter a value between zero and ten.' },
}

export const Controlled: Story = {
    render: function ControlledNumberInput() {
        const [value, setValue] = useState<number | null>(3)
        return (
            <NumberInputField
                id="controlled-quantity"
                label="Quantity"
                min={0}
                max={10}
                value={value}
                onValueChange={setValue}
            />
        )
    },
}

export const ReactHookForm: Story = {
    render: function NumberInputRHF() {
        const { control, handleSubmit } = useForm({ defaultValues: { quantity: 2 } })
        const [submitted, setSubmitted] = useState(false)

        return (
            <form
                noValidate
                className="grid w-72 gap-4"
                onSubmit={handleSubmit(() => setSubmitted(true))}
            >
                <Controller
                    name="quantity"
                    control={control}
                    render={({ field }) => (
                        <NumberInputField
                            id="rhf-quantity"
                            label="Quantity"
                            min={0}
                            max={10}
                            value={field.value}
                            onValueChange={field.onChange}
                            onBlur={field.onBlur}
                            ref={field.ref}
                        />
                    )}
                />
                <Button type="submit">Save quantity</Button>
                {submitted && <p role="status">Quantity saved.</p>}
            </form>
        )
    },
}
