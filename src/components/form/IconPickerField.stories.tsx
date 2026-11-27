import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Controller, useForm } from 'react-hook-form'
import { fn } from 'storybook/test'
import { Button } from '@/components/ui'
import { IconPickerField } from './IconPickerField'
import type { FinanceIconName } from '@/shared/finance-icons'

const meta = {
    title: 'Design System/Composed Fields/IconPickerField',
    component: IconPickerField,
    tags: ['autodocs'],
    args: { id: 'account-icon', label: 'Account icon', value: 'wallet', onValueChange: fn() },
} satisfies Meta<typeof IconPickerField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const DescriptionAndRequired: Story = {
    args: {
        description: 'Choose an icon from the shared finance registry.',
        required: true,
    },
}

export const Disabled: Story = {
    args: { value: 'piggy-bank', disabled: true },
}

export const Invalid: Story = {
    args: { error: 'Choose an account icon.' },
}

export const Controlled: Story = {
    render: function ControlledIconPicker() {
        const [value, setValue] = useState<FinanceIconName>('wallet')
        return (
            <IconPickerField
                id="controlled-icon"
                label="Account icon"
                value={value}
                onValueChange={setValue}
            />
        )
    },
}

export const ReactHookForm: Story = {
    render: function IconPickerRHF() {
        const { control, handleSubmit } = useForm<{ icon: FinanceIconName }>({
            defaultValues: { icon: 'wallet' },
        })
        const [submitted, setSubmitted] = useState(false)

        return (
            <form
                noValidate
                className="grid gap-4"
                onSubmit={handleSubmit(() => setSubmitted(true))}
            >
                <Controller
                    name="icon"
                    control={control}
                    render={({ field }) => (
                        <IconPickerField
                            id="rhf-icon"
                            label="Account icon"
                            required
                            value={field.value}
                            onValueChange={field.onChange}
                            onBlur={field.onBlur}
                            ref={field.ref}
                        />
                    )}
                />
                <Button type="submit">Save icon</Button>
                {submitted && <p role="status">Icon saved.</p>}
            </form>
        )
    },
}
