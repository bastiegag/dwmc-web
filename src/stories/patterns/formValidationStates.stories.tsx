import type { Meta, StoryObj } from '@storybook/react-vite'
import {
    CheckboxField,
    CurrencyInput,
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
    SelectField,
    TextField,
} from '@/components/form'
import { Button, Input } from '@/components/ui'

const meta = {
    title: 'Design System/Patterns/Form Validation States',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component:
                    'Use composed form fields for typical application forms. The manual Field composition is retained as an advanced example for controls that need a custom inline action.',
            },
        },
    },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Valid: Story = {
    render: () => (
        <TextField
            id="validation-valid"
            label="Account name"
            description="Shown on your dashboard."
            defaultValue="Chequing"
        />
    ),
}

export const Invalid: Story = {
    render: () => (
        <TextField
            id="validation-invalid"
            label="Amount"
            description="Use up to two decimal places."
            defaultValue="12.345"
            error="Amount must have at most two decimal places."
        />
    ),
}

export const Disabled: Story = {
    render: () => (
        <TextField
            id="validation-disabled"
            label="Account number"
            defaultValue="0000-1234"
            disabled
        />
    ),
}

export const FormSummary: Story = {
    render: () => (
        <form
            aria-label="Edit account"
            className="flex w-80 flex-col gap-4"
            noValidate
            onSubmit={(event) => event.preventDefault()}
        >
            <TextField
                id="summary-name"
                label="Account name"
                defaultValue=""
                error="Account name is required."
            />
            <SelectField
                id="summary-type"
                label="Account type"
                defaultValue="checking"
                options={[
                    { value: 'checking', label: 'Checking' },
                    { value: 'savings', label: 'Savings' },
                ]}
            />
            <CurrencyInput
                id="summary-limit"
                label="Monthly limit"
                description="Enter an amount with up to two decimal places."
                currency="CAD"
                locale="en-CA"
                defaultValue="12.345"
                error="Use no more than two decimal places."
            />
            <CheckboxField
                id="summary-confirm"
                label="Confirm account details"
                error="Please confirm the account details."
            />
            <Button type="submit">Save changes</Button>
        </form>
    ),
}

export const AdvancedManualComposition: Story = {
    render: () => (
        <Field className="w-80" invalid>
            <FieldLabel htmlFor="reference-code">Transaction reference</FieldLabel>
            <div className="flex items-center gap-2">
                <Input
                    id="reference-code"
                    defaultValue="AB"
                    aria-invalid="true"
                    aria-describedby="reference-code-description reference-code-error"
                />
                <Button type="button" variant="outlined" size="sm">
                    Generate
                </Button>
            </div>
            <FieldDescription id="reference-code-description">
                Use a short code to identify this transaction.
            </FieldDescription>
            <FieldError id="reference-code-error">Reference code is already in use.</FieldError>
        </Field>
    ),
}
