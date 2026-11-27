import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Controller, useForm } from 'react-hook-form'
import { Button } from '@/components/ui'
import { ComboboxField } from './ComboboxField'

const accounts = ['Checking', 'Savings', 'Credit card']

const meta = {
    title: 'Design System/Composed Fields/ComboboxField',
    component: ComboboxField,
    tags: ['autodocs'],
    args: { id: 'account', label: 'Account', options: accounts },
} satisfies Meta<typeof ComboboxField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const DescriptionAndRequired: Story = {
    args: {
        description: 'Search for and choose an account.',
        required: true,
    },
}

export const CustomOptions: Story = {
    args: { renderOption: (option) => `${option} account` },
}

export const Disabled: Story = {
    args: { disabled: true, defaultValue: 'Savings' },
}

export const Invalid: Story = {
    args: { error: 'Choose an account before continuing.' },
}

export const Controlled: Story = {
    render: function ControlledCombobox() {
        const [value, setValue] = useState<string | null>('Savings')
        return (
            <ComboboxField
                id="controlled-account"
                label="Account"
                options={accounts}
                value={value}
                onValueChange={setValue}
            />
        )
    },
}

export const ReactHookForm: Story = {
    render: function ComboboxRHF() {
        const { control, handleSubmit } = useForm({
            defaultValues: { account: null as string | null },
        })
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
                        <ComboboxField
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
