import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import {
    NumberField,
    NumberFieldDecrement,
    NumberFieldGroup,
    NumberFieldIncrement,
    NumberFieldInput,
} from './NumberField'

const meta = {
    title: 'Design System/Components/Forms/Number Field',
    component: NumberField,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component:
                    'Stepper for whole or fractional quantities. Compose `NumberFieldGroup`, `NumberFieldDecrement`, `NumberFieldInput`, and `NumberFieldIncrement`. Use `min`, `max`, and `step` on the root to constrain values. Give the input an accessible name with `aria-label` or a label. Use `defaultValue` for uncontrolled state or `value`/`onValueChange` for controlled state.',
            },
        },
    },
} satisfies Meta<typeof NumberField>

export default meta
type Story = StoryObj<typeof meta>

const Stepper = (props: { label: string }) => (
    <NumberFieldGroup>
        <NumberFieldDecrement />
        <NumberFieldInput aria-label={props.label} />
        <NumberFieldIncrement />
    </NumberFieldGroup>
)

export const Default: Story = {
    render: () => (
        <NumberField defaultValue={2} min={0} max={10}>
            <Stepper label="Quantity" />
        </NumberField>
    ),
}

export const Step: Story = {
    name: 'Step',
    render: () => (
        <NumberField defaultValue={0.5} min={0} max={5} step={0.5}>
            <Stepper label="Hours" />
        </NumberField>
    ),
}

export const Controlled: Story = {
    render: function ControlledRender() {
        const [value, setValue] = useState<number | null>(3)
        return (
            <div className="space-y-2">
                <NumberField value={value} onValueChange={setValue} min={0} max={10}>
                    <Stepper label="Installments" />
                </NumberField>
                <p className="text-sm text-muted-foreground">Value: {value ?? 'empty'}</p>
            </div>
        )
    },
}

export const Disabled: Story = {
    render: () => (
        <NumberField defaultValue={4} disabled>
            <Stepper label="Quantity" />
        </NumberField>
    ),
}
