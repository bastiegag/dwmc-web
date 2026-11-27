import { Controller, useForm } from 'react-hook-form'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@/test/utils/render'
import { SelectField } from './SelectField'

const options = [
    { value: 'checking', label: 'Checking' },
    { value: 'savings', label: 'Savings' },
]

describe('SelectField', () => {
    it('renders a labeled required select and connects description and error', () => {
        render(
            <SelectField
                id="account"
                label="Account"
                description="Choose an account."
                error="Select an account."
                options={options}
                required
            />,
        )

        const trigger = screen.getByRole('combobox', { name: 'Account' })
        expect(trigger).toHaveAttribute('aria-required', 'true')
        expect(trigger).toHaveAttribute('aria-invalid', 'true')
        expect(trigger).toHaveAttribute('aria-describedby', 'account-description account-error')
        expect(screen.getByRole('alert')).toHaveTextContent('Select an account.')
    })

    it('selects a generated grouped option with the keyboard', async () => {
        const user = userEvent.setup()
        const onValueChange = vi.fn()
        render(
            <SelectField
                id="account"
                label="Account"
                groups={[{ label: 'Cash accounts', options }]}
                onValueChange={onValueChange}
            />,
        )

        const trigger = screen.getByRole('combobox', { name: 'Account' })
        await user.click(trigger)
        expect(await screen.findByRole('group', { name: 'Cash accounts' })).toBeInTheDocument()
        await user.keyboard('{ArrowDown}{Enter}')

        expect(onValueChange).toHaveBeenLastCalledWith('checking', expect.anything())
        expect(trigger).toHaveTextContent('Checking')
    })

    it('preserves custom content and uncontrolled default values', () => {
        render(
            <SelectField
                id="account"
                label="Account"
                defaultValue="savings"
                options={options}
                valueLabel="Emergency savings"
            />,
        )

        expect(screen.getByRole('combobox', { name: 'Account' })).toHaveTextContent(
            'Emergency savings',
        )
    })

    it('supports React Hook Form Controller values and refs', async () => {
        const user = userEvent.setup()
        const onSubmit = vi.fn()

        function SelectForm() {
            const { control, handleSubmit } = useForm({ defaultValues: { account: 'checking' } })
            return (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        name="account"
                        control={control}
                        render={({ field }) => (
                            <SelectField
                                id="account"
                                label="Account"
                                options={options}
                                value={field.value}
                                onValueChange={field.onChange}
                                onBlur={field.onBlur}
                                ref={field.ref}
                            />
                        )}
                    />
                    <button type="submit">Save</button>
                </form>
            )
        }

        render(<SelectForm />)
        await user.click(screen.getByRole('combobox', { name: 'Account' }))
        await user.keyboard('{ArrowDown}{ArrowDown}{Enter}')
        await user.click(screen.getByRole('button', { name: 'Save' }))

        expect(onSubmit).toHaveBeenCalledWith({ account: 'savings' }, expect.anything())
    })
})
