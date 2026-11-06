import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { CurrencyInput } from './CurrencyInput'
import { Field, FieldError, FieldLabel } from './Field'

const meta = {
    title: 'Design System/Components/Forms/Currency Input',
    component: CurrencyInput,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component:
                    'Monetary amount input. The value is a decimal string (`"12.50"`), `null` when empty, and `"0"` for zero. The field shows a localized currency format on blur and an editable decimal while focused. Use `value`/`onValueChange` for controlled state, or `defaultValue` for uncontrolled state. Use `min`/`max` as decimal strings and `allowNegative` to permit negatives.',
            },
        },
    },
} satisfies Meta<typeof CurrencyInput>

export default meta
type Story = StoryObj<typeof meta>

export const CAD: Story = {
    args: { label: 'Amount', currency: 'CAD', locale: 'en-CA', defaultValue: '1234.50' },
}

export const Empty: Story = {
    args: { label: 'Amount', currency: 'CAD', locale: 'en-CA' },
}

export const Zero: Story = {
    args: { label: 'Amount', currency: 'CAD', locale: 'en-CA', defaultValue: '0' },
}

export const NegativeAllowed: Story = {
    args: {
        label: 'Adjustment',
        currency: 'CAD',
        locale: 'en-CA',
        allowNegative: true,
        defaultValue: '-25.99',
    },
}

export const Invalid: Story = {
    args: {
        label: 'Amount',
        currency: 'CAD',
        locale: 'en-CA',
        defaultValue: '0',
        min: '1',
        error: 'Enter an amount of at least $1.00.',
    },
}

export const Disabled: Story = {
    args: {
        label: 'Amount',
        currency: 'CAD',
        locale: 'en-CA',
        defaultValue: '45.00',
        disabled: true,
    },
}

export const Controlled: Story = {
    render: function ControlledRender() {
        const [value, setValue] = useState<string | null>('250.00')
        return (
            <div className="w-72 space-y-3">
                <CurrencyInput
                    label="Amount"
                    currency="CAD"
                    locale="en-CA"
                    value={value}
                    onValueChange={setValue}
                />
                <p className="text-sm text-muted-foreground">Value: {value ?? 'empty'}</p>
                <Button variant="outlined" onClick={() => setValue(null)}>
                    Clear
                </Button>
            </div>
        )
    },
}

type TransferFormValues = { amount: string | null }

const TransferForm = () => {
    const { control, handleSubmit } = useForm<TransferFormValues>({
        defaultValues: { amount: null },
    })
    const [submitted, setSubmitted] = useState<string | null>(null)

    return (
        <form
            className="w-72 space-y-3"
            onSubmit={handleSubmit((values) => setSubmitted(values.amount))}
            noValidate
        >
            <Controller
                name="amount"
                control={control}
                rules={{ required: 'Enter an amount.' }}
                render={({ field, fieldState }) => (
                    <Field invalid={Boolean(fieldState.error)}>
                        <FieldLabel htmlFor="transfer-amount">Amount</FieldLabel>
                        <CurrencyInput
                            id="transfer-amount"
                            name={field.name}
                            ref={field.ref}
                            value={field.value}
                            onValueChange={field.onChange}
                            onBlur={field.onBlur}
                            currency="CAD"
                            locale="en-CA"
                            required
                            error={fieldState.error?.message}
                        />
                        {fieldState.error ? (
                            <FieldError>{fieldState.error.message}</FieldError>
                        ) : null}
                    </Field>
                )}
            />
            <Button type="submit">Save</Button>
            {submitted !== null ? <p className="text-sm">Saved: {submitted}</p> : null}
        </form>
    )
}

export const FormExample: Story = {
    render: () => <TransferForm />,
}
