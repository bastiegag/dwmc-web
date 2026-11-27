import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Controller, useForm } from 'react-hook-form'
import { Button } from '@/components/ui'
import { SelectField } from './SelectField'

const accounts = [
    { value: 'checking', label: 'Everyday spending' },
    { value: 'savings', label: 'Savings' },
]

const meta = {
    title: 'Design System/Composed Fields/SelectField',
    component: SelectField,
    tags: ['autodocs'],
    args: { id: 'account', label: 'Account', options: accounts },
} satisfies Meta<typeof SelectField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: { placeholder: 'Choose an account' },
}

export const DescriptionAndRequired: Story = {
    args: {
        description: 'Choose the account for this transaction.',
        placeholder: 'Choose an account',
        required: true,
    },
}

export const GroupedOptions: Story = {
    args: {
        options: undefined,
        groups: [
            { label: 'Cash accounts', options: accounts },
            { label: 'Credit', options: [{ value: 'visa', label: 'Credit card' }] },
        ],
    },
}

export const Disabled: Story = {
    args: { disabled: true, defaultValue: 'checking' },
}

export const Invalid: Story = {
    args: { error: 'Choose an account before continuing.' },
}

export const Controlled: Story = {
    render: function ControlledSelect() {
        const [value, setValue] = useState<string | null>('checking')
        return (
            <SelectField
                id="controlled-account"
                label="Account"
                options={accounts}
                value={value}
                onValueChange={(nextValue) => {
                    if (nextValue !== null && typeof nextValue !== 'string') {
                        throw new TypeError('SelectField account values must be strings.')
                    }
                    setValue(nextValue)
                }}
            />
        )
    },
}

export const ReactHookForm: Story = {
    render: function SelectRHF() {
        const { control, handleSubmit } = useForm({ defaultValues: { account: 'checking' } })
        const [submitted, setSubmitted] = useState(false)

        return (
            <form
                noValidate
                className="grid w-72 gap-4"
                onSubmit={handleSubmit(() => setSubmitted(true))}
            >
                <Controller
                    name="account"
                    control={control}
                    render={({ field }) => (
                        <SelectField
                            id="rhf-account"
                            label="Account"
                            options={accounts}
                            value={field.value}
                            onValueChange={field.onChange}
                            onBlur={field.onBlur}
                            ref={field.ref}
                        />
                    )}
                />
                <Button type="submit">Continue</Button>
                {submitted && <p role="status">Account saved.</p>}
            </form>
        )
    },
}
