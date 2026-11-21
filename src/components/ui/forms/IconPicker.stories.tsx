import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { IconPicker } from './IconPicker'
import type { FinanceIconName } from '@/shared/finance-icons'

const meta = {
    title: 'Design System/Components/Forms/Icon Picker',
    component: IconPicker,
    tags: ['autodocs'],
    args: { value: 'wallet', onValueChange: fn() },
    parameters: {
        docs: {
            description: {
                component:
                    'Selects a finance icon from the shared account and category icon registry.',
            },
        },
    },
} satisfies Meta<typeof IconPicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: function DefaultIconPicker() {
        const [value, setValue] = useState<FinanceIconName>('wallet')

        return (
            <div className="space-y-3">
                <IconPicker value={value} onValueChange={setValue} />
                <p className="text-sm text-muted-foreground" aria-live="polite">
                    Selected icon: {value}
                </p>
            </div>
        )
    },
}

export const Disabled: Story = {
    args: { value: 'piggy-bank', disabled: true },
}

export const Invalid: Story = {
    args: { value: 'shopping-cart', invalid: true, 'aria-describedby': 'icon-picker-error' },
    decorators: [
        (Story) => (
            <div className="space-y-2">
                <Story />
                <p id="icon-picker-error" className="text-sm text-destructive-border">
                    Choose a supported icon.
                </p>
            </div>
        ),
    ],
}
