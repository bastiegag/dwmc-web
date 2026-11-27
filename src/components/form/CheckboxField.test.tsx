import { Controller, useForm } from 'react-hook-form'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@/test/utils/render'
import { CheckboxField } from './CheckboxField'

describe('CheckboxField', () => {
    it('associates the label, description, required state, and error with the control', () => {
        render(
            <CheckboxField
                id="consent"
                label="Accept the terms"
                description="Required before continuing."
                error="Accept the terms to continue."
                required
            />,
        )

        const checkbox = screen.getByRole('checkbox', { name: 'Accept the terms' })
        expect(checkbox).toHaveAttribute('aria-describedby', 'consent-description consent-error')
        expect(checkbox).toHaveAttribute('aria-invalid', 'true')
        expect(screen.getByRole('alert')).toHaveTextContent('Accept the terms to continue.')
        expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true')
    })

    it('toggles when its label is clicked and honors disabled state', async () => {
        const user = userEvent.setup()
        render(
            <>
                <CheckboxField id="enabled" label="Enable reports" />
                <CheckboxField id="disabled" label="Disabled reports" disabled />
            </>,
        )

        const enabled = screen.getByRole('checkbox', { name: 'Enable reports' })
        await user.click(screen.getByText('Enable reports'))
        expect(enabled).toBeChecked()
        expect(screen.getByRole('checkbox', { name: 'Disabled reports' })).toHaveAttribute(
            'aria-disabled',
            'true',
        )
    })

    it('works with React Hook Form controlled state and submit values', async () => {
        const user = userEvent.setup()
        const onSubmit = vi.fn()

        function CheckboxForm() {
            const { control, handleSubmit } = useForm({ defaultValues: { accepted: false } })
            return (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        name="accepted"
                        control={control}
                        render={({ field }) => (
                            <CheckboxField
                                id="accepted"
                                label="Accept terms"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                onBlur={field.onBlur}
                                ref={field.ref}
                            />
                        )}
                    />
                    <button type="submit">Save</button>
                </form>
            )
        }

        render(<CheckboxForm />)
        await user.click(screen.getByText('Accept terms'))
        await user.click(screen.getByRole('button', { name: 'Save' }))

        expect(onSubmit).toHaveBeenCalledWith({ accepted: true }, expect.anything())
    })
})
