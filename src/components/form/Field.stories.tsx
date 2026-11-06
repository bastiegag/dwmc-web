import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from '@/components/ui/input'
import { Field, FieldDescription, FieldError, FieldLabel, FieldLegend, Fieldset } from './Field'

const meta = {
    title: 'Design System/Components/Forms/Field',
    component: Field,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component:
                    'Layout wrapper that connects a `FieldLabel`, control, `FieldDescription`, and `FieldError`. Pass `invalid` to mark the field, and pair the control with `aria-describedby` and `aria-invalid` so the description and error are announced. Use `Fieldset` with `FieldLegend` to group related controls such as radio options.',
            },
        },
    },
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => (
        <Field className="w-72">
            <FieldLabel htmlFor="field-default">Account name</FieldLabel>
            <Input id="field-default" />
        </Field>
    ),
}

export const WithDescription: Story = {
    render: () => (
        <Field className="w-72">
            <FieldLabel htmlFor="field-description">Monthly budget</FieldLabel>
            <Input id="field-description" aria-describedby="field-description-hint" />
            <FieldDescription id="field-description-hint">
                Used to calculate your monthly summary.
            </FieldDescription>
        </Field>
    ),
}

export const Required: Story = {
    render: () => (
        <Field className="w-72">
            <FieldLabel htmlFor="field-required">
                Account name <span aria-hidden="true">*</span>
            </FieldLabel>
            <Input id="field-required" required aria-required="true" />
        </Field>
    ),
}

export const Invalid: Story = {
    render: () => (
        <Field className="w-72" invalid>
            <FieldLabel htmlFor="field-invalid">Account name</FieldLabel>
            <Input
                id="field-invalid"
                aria-invalid="true"
                aria-describedby="field-invalid-error"
                defaultValue=""
            />
            <FieldError id="field-invalid-error">Enter an account name.</FieldError>
        </Field>
    ),
}

export const Disabled: Story = {
    render: () => (
        <Field className="w-72" disabled>
            <FieldLabel htmlFor="field-disabled">Account name</FieldLabel>
            <Input id="field-disabled" disabled />
        </Field>
    ),
}

export const GroupedFieldset: Story = {
    name: 'Fieldset',
    render: () => (
        <Fieldset className="w-72">
            <FieldLegend>Contact preferences</FieldLegend>
            <Field>
                <FieldLabel htmlFor="field-email">Email</FieldLabel>
                <Input id="field-email" type="email" />
            </Field>
            <Field>
                <FieldLabel htmlFor="field-phone">Phone</FieldLabel>
                <Input id="field-phone" type="tel" />
            </Field>
        </Fieldset>
    ),
}
