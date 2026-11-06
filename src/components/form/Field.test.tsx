import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'
import { Input } from '@/components/ui'
import { Field, FieldDescription, FieldError, FieldLabel, FieldLegend, Fieldset } from './Field'

describe('Field', () => {
    it('associates the label with the control', () => {
        render(
            <Field>
                <FieldLabel htmlFor="account-name">Account name</FieldLabel>
                <Input id="account-name" />
            </Field>,
        )

        expect(screen.getByRole('textbox', { name: 'Account name' })).toBeInTheDocument()
    })

    it('links the description to the control', () => {
        render(
            <Field>
                <FieldLabel htmlFor="budget">Monthly budget</FieldLabel>
                <Input id="budget" aria-describedby="budget-hint" />
                <FieldDescription id="budget-hint">Used for your monthly summary.</FieldDescription>
            </Field>,
        )

        expect(screen.getByRole('textbox', { name: 'Monthly budget' })).toHaveAccessibleDescription(
            'Used for your monthly summary.',
        )
    })

    it('announces invalid state and the error message', () => {
        render(
            <Field invalid>
                <FieldLabel htmlFor="amount">Amount</FieldLabel>
                <Input id="amount" aria-invalid="true" aria-describedby="amount-error" />
                <FieldError id="amount-error">Enter an amount.</FieldError>
            </Field>,
        )

        const input = screen.getByRole('textbox', { name: 'Amount' })
        expect(input).toHaveAttribute('aria-invalid', 'true')
        expect(input).toHaveAccessibleDescription('Enter an amount.')
        expect(screen.getByRole('alert')).toHaveTextContent('Enter an amount.')
    })

    it('keeps required semantics on the control', async () => {
        const user = userEvent.setup()
        render(
            <Field>
                <FieldLabel htmlFor="owner">Owner</FieldLabel>
                <Input id="owner" required />
            </Field>,
        )

        const input = screen.getByRole('textbox', { name: 'Owner' })
        expect(input).toBeRequired()
        await user.type(input, 'Sam')
        expect(input).toHaveValue('Sam')
    })

    it('groups related controls under the fieldset legend', () => {
        render(
            <Fieldset>
                <FieldLegend>Contact preferences</FieldLegend>
                <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input id="email" type="email" />
                </Field>
            </Fieldset>,
        )

        expect(screen.getByRole('group', { name: 'Contact preferences' })).toBeInTheDocument()
        expect(screen.getByRole('textbox', { name: 'Email' })).toBeInTheDocument()
    })

    it('has no detectable accessibility violations', async () => {
        const { container } = render(
            <Fieldset>
                <FieldLegend>Contact preferences</FieldLegend>
                <Field invalid>
                    <FieldLabel htmlFor="phone">Phone</FieldLabel>
                    <Input
                        id="phone"
                        type="tel"
                        aria-invalid="true"
                        aria-describedby="phone-error"
                    />
                    <FieldError id="phone-error">Enter a phone number.</FieldError>
                </Field>
            </Fieldset>,
        )
        expect((await axe(container)).violations).toHaveLength(0)
    })
})
