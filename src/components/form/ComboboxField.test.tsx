import { Controller, useForm } from 'react-hook-form'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@/test/utils/render'
import { ComboboxField } from './ComboboxField'

const options = ['Checking', 'Savings', 'Credit card']

describe('ComboboxField', () => {
    it('filters options and selects with keyboard navigation', async () => {
        const user = userEvent.setup()
        const onValueChange = vi.fn()
        render(
            <ComboboxField
                id="account"
                label="Account"
                options={options}
                onValueChange={onValueChange}
            />,
        )

        const input = screen.getByRole('combobox', { name: 'Account' })
        await user.type(input, 'sav')
        expect(await screen.findByRole('option', { name: 'Savings' })).toBeInTheDocument()
        expect(screen.queryByRole('option', { name: 'Checking' })).not.toBeInTheDocument()
        await user.keyboard('{ArrowDown}{Enter}')

        expect(input).toHaveValue('Savings')
        expect(onValueChange).toHaveBeenLastCalledWith('Savings', expect.anything())
    })

    it('connects description and error while exposing required and disabled states', () => {
        render(
            <ComboboxField
                id="account"
                label="Account"
                options={options}
                description="Search your accounts."
                error="Choose an account."
                required
                disabled
            />,
        )

        const input = screen.getByRole('combobox', { name: 'Account' })
        expect(input).toBeDisabled()
        expect(input).toHaveAttribute('required')
        expect(input).toHaveAttribute('aria-invalid', 'true')
        expect(input).toHaveAttribute('aria-describedby', 'account-description account-error')
        expect(screen.getByRole('alert')).toHaveTextContent('Choose an account.')
    })

    it('supports custom option rendering and controlled values', async () => {
        const user = userEvent.setup()
        const onValueChange = vi.fn()
        render(
            <ComboboxField
                id="account"
                label="Account"
                options={options}
                value="Checking"
                onValueChange={onValueChange}
                renderOption={(option) => `${option} account`}
            />,
        )

        const input = screen.getByRole('combobox', { name: 'Account' })
        expect(input).toHaveValue('Checking')
        await user.click(input)
        expect(await screen.findByRole('option', { name: 'Savings account' })).toBeInTheDocument()
    })

    it('integrates with React Hook Form Controller', async () => {
        const user = userEvent.setup()
        const onSubmit = vi.fn()

        function ComboboxForm() {
            const { control, handleSubmit } = useForm({
                defaultValues: { account: null as string | null },
            })
            return (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        name="account"
                        control={control}
                        render={({ field }) => (
                            <ComboboxField
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

        render(<ComboboxForm />)
        const input = screen.getByRole('combobox', { name: 'Account' })
        await user.type(input, 'cred')
        await user.keyboard('{ArrowDown}{Enter}')
        await user.click(screen.getByRole('button', { name: 'Save' }))

        expect(onSubmit).toHaveBeenCalledWith({ account: 'Credit card' }, expect.anything())
    })
})
