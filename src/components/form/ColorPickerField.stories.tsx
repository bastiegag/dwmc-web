import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Controller, useForm } from 'react-hook-form'
import { fn } from 'storybook/test'
import { Button } from '@/components/ui'
import { ColorPickerField } from './ColorPickerField'
import type { SemanticColor } from '@/shared/semantic-colors'

const meta = {
    title: 'Design System/Form Fields/Color Picker Field',
    component: ColorPickerField,
    tags: ['autodocs'],
    args: { id: 'section-color', label: 'Section color', value: 'primary', onValueChange: fn() },
} satisfies Meta<typeof ColorPickerField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const DescriptionAndRequired: Story = {
    args: {
        description: 'Choose one of the supported semantic colors.',
        required: true,
    },
}

export const Disabled: Story = {
    args: { value: 'warning', disabled: true },
}

export const Invalid: Story = {
    args: { error: 'Choose a section color.' },
}

export const Controlled: Story = {
    render: function ControlledColorPicker() {
        const [value, setValue] = useState<SemanticColor>('primary')
        return (
            <ColorPickerField
                id="controlled-color"
                label="Section color"
                value={value}
                onValueChange={setValue}
            />
        )
    },
}

export const ReactHookForm: Story = {
    render: function ColorPickerRHF() {
        const { control, handleSubmit } = useForm<{ color: SemanticColor }>({
            defaultValues: { color: 'primary' },
        })
        const [submitted, setSubmitted] = useState(false)

        return (
            <form
                noValidate
                className="grid gap-4"
                onSubmit={handleSubmit(() => setSubmitted(true))}
            >
                <Controller
                    name="color"
                    control={control}
                    render={({ field }) => (
                        <ColorPickerField
                            id="rhf-color"
                            label="Section color"
                            required
                            value={field.value}
                            onValueChange={field.onChange}
                            onBlur={field.onBlur}
                            ref={field.ref}
                        />
                    )}
                />
                <Button type="submit">Save color</Button>
                {submitted && <p role="status">Color saved.</p>}
            </form>
        )
    },
}
