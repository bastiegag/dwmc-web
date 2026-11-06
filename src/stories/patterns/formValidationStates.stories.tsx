import type { Meta, StoryObj } from '@storybook/react-vite'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/form/Field'
import { Input } from '@/components/ui'

const meta = {
    title: 'Design System/Patterns/Form Validation States',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component:
                    'Recommended composition for validated fields: Field owns the layout and invalid/disabled flags, FieldLabel and Input are associated by id, FieldDescription and FieldError are linked through aria-describedby, and Input receives aria-invalid when an error is shown.',
            },
        },
    },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const ValidatedField = ({
    id,
    label,
    description,
    error,
    defaultValue,
    disabled = false,
}: {
    id: string
    label: string
    description?: string
    error?: string
    defaultValue?: string
    disabled?: boolean
}) => {
    const descriptionId = description ? `${id}-description` : undefined
    const errorId = error ? `${id}-error` : undefined
    const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined

    return (
        <Field invalid={Boolean(error)} disabled={disabled} className="w-72">
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            <Input
                id={id}
                defaultValue={defaultValue}
                disabled={disabled}
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy}
            />
            {description ? (
                <FieldDescription id={descriptionId}>{description}</FieldDescription>
            ) : null}
            {error ? <FieldError id={errorId}>{error}</FieldError> : null}
        </Field>
    )
}

export const Valid: Story = {
    render: () => (
        <ValidatedField
            id="validation-valid"
            label="Account name"
            description="Shown on your dashboard."
            defaultValue="Chequing"
        />
    ),
}

export const Invalid: Story = {
    render: () => (
        <ValidatedField
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
        <ValidatedField
            id="validation-disabled"
            label="Account number"
            defaultValue="0000-1234"
            disabled
        />
    ),
}

export const FormSummary: Story = {
    render: () => (
        <form className="flex w-72 flex-col gap-6" noValidate>
            <ValidatedField
                id="summary-name"
                label="Name"
                defaultValue=""
                error="Name is required."
            />
            <ValidatedField
                id="summary-limit"
                label="Monthly limit"
                description="Enter a positive amount."
                defaultValue="-50"
                error="Limit must be greater than zero."
            />
        </form>
    ),
}
