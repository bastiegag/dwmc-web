import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm, Controller } from 'react-hook-form'
import { describe, expect, it, vi } from 'vitest'
import { CurrencyInput } from './CurrencyInput'

const getInput = () => screen.getByRole<HTMLInputElement>('textbox')

describe('CurrencyInput', () => {
    it('starts empty without emitting a value', () => {
        const onValueChange = vi.fn()
        render(<CurrencyInput label="Amount" onValueChange={onValueChange} />)
        expect(getInput()).toHaveValue('')
        expect(onValueChange).not.toHaveBeenCalled()
    })

    it('keeps zero distinct from empty', async () => {
        const user = userEvent.setup()
        const onValueChange = vi.fn()
        render(<CurrencyInput label="Amount" onValueChange={onValueChange} />)
        await user.type(getInput(), '0')
        expect(onValueChange).toHaveBeenLastCalledWith('0')
        await user.clear(getInput())
        expect(onValueChange).toHaveBeenLastCalledWith(null)
    })

    it('reflects controlled value updates when not focused', () => {
        const { rerender } = render(<CurrencyInput label="Amount" value="5" />)
        expect(getInput()).toHaveValue('$5.00')
        rerender(<CurrencyInput label="Amount" value="10.5" />)
        expect(getInput()).toHaveValue('$10.50')
        rerender(<CurrencyInput label="Amount" value={null} />)
        expect(getInput()).toHaveValue('')
    })

    it('does not change a controlled value until the parent updates it', async () => {
        const user = userEvent.setup()
        const onValueChange = vi.fn()
        render(<CurrencyInput label="Amount" value="5" onValueChange={onValueChange} />)
        await user.click(getInput())
        await user.type(getInput(), '1')
        expect(onValueChange).toHaveBeenLastCalledWith('51')
        expect(getInput()).toHaveValue('5')
    })

    it('updates an uncontrolled value from defaultValue and user input', async () => {
        const user = userEvent.setup()
        const onValueChange = vi.fn()
        render(<CurrencyInput label="Amount" defaultValue="3" onValueChange={onValueChange} />)
        expect(getInput()).toHaveValue('$3.00')
        await user.click(getInput())
        await user.type(getInput(), '.25')
        expect(onValueChange).toHaveBeenLastCalledWith('3.25')
        await user.tab()
        expect(getInput()).toHaveValue('$3.25')
    })

    it('accepts decimal values with up to two places', async () => {
        const user = userEvent.setup()
        const onValueChange = vi.fn()
        render(<CurrencyInput label="Amount" onValueChange={onValueChange} />)
        await user.type(getInput(), '1234.5')
        expect(onValueChange).toHaveBeenLastCalledWith('1234.5')
    })

    it('preserves intermediate decimal input', async () => {
        const user = userEvent.setup()
        const onValueChange = vi.fn()
        render(<CurrencyInput label="Amount" onValueChange={onValueChange} />)
        await user.type(getInput(), '12.')
        expect(getInput()).toHaveValue('12.')
        expect(onValueChange).toHaveBeenLastCalledWith('12')
        await user.type(getInput(), '0')
        expect(onValueChange).toHaveBeenLastCalledWith('12.0')
    })

    it('rejects invalid characters', async () => {
        const user = userEvent.setup()
        render(<CurrencyInput label="Amount" />)
        await user.type(getInput(), 'a1,$b2')
        expect(getInput()).toHaveValue('12')
    })

    it('rejects a third decimal place without rounding or truncating', async () => {
        const user = userEvent.setup()
        const onValueChange = vi.fn()
        render(<CurrencyInput label="Amount" onValueChange={onValueChange} />)
        await user.type(getInput(), '1.234')
        expect(getInput()).toHaveValue('1.23')
        expect(onValueChange).toHaveBeenLastCalledWith('1.23')
    })

    it('allows negative values only when enabled', async () => {
        const user = userEvent.setup()
        const onValueChange = vi.fn()
        const { unmount } = render(
            <CurrencyInput label="Amount" allowNegative onValueChange={onValueChange} />,
        )
        await user.type(getInput(), '-25.99')
        expect(onValueChange).toHaveBeenLastCalledWith('-25.99')
        unmount()

        render(<CurrencyInput label="Positive" onValueChange={onValueChange} />)
        await user.type(screen.getByLabelText('Positive'), '-5')
        expect(screen.getByLabelText('Positive')).toHaveValue('5')
    })

    it('restores an editable value on focus after a formatted blur', async () => {
        const user = userEvent.setup()
        render(<CurrencyInput label="Amount" defaultValue="1234.5" />)
        expect(getInput()).toHaveValue('$1,234.50')
        await user.click(getInput())
        expect(getInput()).toHaveValue('1234.5')
        await user.tab()
        expect(getInput()).toHaveValue('$1,234.50')
    })

    it('lets users edit a previously formatted amount', async () => {
        const user = userEvent.setup()
        const onValueChange = vi.fn()
        render(
            <CurrencyInput label="Amount" defaultValue="1234.50" onValueChange={onValueChange} />,
        )
        await user.click(getInput())
        await user.clear(getInput())
        await user.type(getInput(), '99')
        expect(onValueChange).toHaveBeenLastCalledWith('99')
        await user.tab()
        expect(getInput()).toHaveValue('$99.00')
    })

    it('formats with the configured currency and locale', () => {
        render(<CurrencyInput label="Amount" currency="EUR" locale="de-DE" defaultValue="1234.5" />)
        expect(getInput().value).toMatch(/^1\.234,50\s€$/)
    })

    it('uses locale-aware display while editing with a decimal point', async () => {
        const user = userEvent.setup()
        render(<CurrencyInput label="Amount" locale="fr-CA" defaultValue="1234.5" />)
        expect(getInput().value).toMatch(/^1\s234,50\s\$$/)
        await user.click(getInput())
        expect(getInput()).toHaveValue('1234.5')
    })

    it('validates minimum and maximum amounts on blur', async () => {
        const user = userEvent.setup()
        render(<CurrencyInput label="Amount" min="10" max="100" defaultValue="5" />)
        await user.click(getInput())
        await user.tab()
        expect(getInput()).toHaveAttribute('aria-invalid', 'true')
        expect(screen.getByRole('alert')).toHaveTextContent('at least $10.00')

        await user.click(getInput())
        await user.clear(getInput())
        await user.type(getInput(), '150')
        await user.tab()
        expect(screen.getByRole('alert')).toHaveTextContent('at most $100.00')
    })

    it('exposes error and description text through accessible relationships', () => {
        render(
            <CurrencyInput
                label="Amount"
                description="Enter the amount paid"
                error="Amount is required"
                defaultValue="1"
            />,
        )
        const input = getInput()
        expect(input).toHaveAttribute('aria-invalid', 'true')
        expect(input).toHaveAccessibleDescription('Enter the amount paid Amount is required')
        expect(screen.getByRole('alert')).toHaveTextContent('Amount is required')
    })

    it('ignores edits when disabled', async () => {
        const user = userEvent.setup()
        render(<CurrencyInput label="Amount" disabled defaultValue="5" />)
        expect(getInput()).toBeDisabled()
        await user.click(getInput())
        await user.type(getInput(), '1')
        expect(getInput()).toHaveValue('$5.00')
    })

    it('ignores edits when read-only', async () => {
        const user = userEvent.setup()
        render(<CurrencyInput label="Amount" readOnly defaultValue="5" />)
        await user.click(getInput())
        await user.type(getInput(), '1')
        expect(getInput()).toHaveAttribute('readonly')
        expect(getInput()).toHaveValue('5')
    })

    it('works with React Hook Form controllers', async () => {
        const user = userEvent.setup()
        const onSubmit = vi.fn()

        function Form() {
            const { control, handleSubmit } = useForm<{ amount: string | null }>({
                defaultValues: { amount: null },
            })
            return (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        name="amount"
                        control={control}
                        render={({ field }) => (
                            <CurrencyInput
                                label="Amount"
                                name={field.name}
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

        render(<Form />)
        await user.type(getInput(), '12.5')
        await user.tab()
        await user.click(screen.getByRole('button', { name: 'Save' }))
        await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))
        expect(onSubmit.mock.calls[0][0]).toEqual({ amount: '12.5' })
    })
})
