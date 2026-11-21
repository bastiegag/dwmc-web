import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { ColorPicker } from './ColorPicker'
import type { SemanticColor } from '@/shared/semantic-colors'

const meta = {
    title: 'Design System/Components/Forms/Color Picker',
    component: ColorPicker,
    tags: ['autodocs'],
    args: { value: 'primary', onValueChange: fn() },
    parameters: {
        docs: {
            description: {
                component:
                    'Selects one of the supported semantic theme colors with radio-group keyboard behavior.',
            },
        },
    },
} satisfies Meta<typeof ColorPicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: function DefaultColorPicker() {
        const [value, setValue] = useState<SemanticColor>('primary')

        return (
            <div className="space-y-3">
                <ColorPicker value={value} onValueChange={setValue} />
                <p className="text-sm text-muted-foreground" aria-live="polite">
                    Selected color: {value}
                </p>
            </div>
        )
    },
}

export const Disabled: Story = {
    args: { value: 'warning', disabled: true },
}

export const Invalid: Story = {
    render: function InvalidColorPicker() {
        const [value, setValue] = useState<SemanticColor>('destructive')

        return (
            <div className="space-y-2">
                <ColorPicker
                    value={value}
                    onValueChange={setValue}
                    invalid
                    aria-describedby="color-picker-error"
                />
                <p id="color-picker-error" className="text-sm text-destructive-border">
                    Choose a supported color.
                </p>
            </div>
        )
    },
}
