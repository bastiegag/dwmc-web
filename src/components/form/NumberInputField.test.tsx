import { Controller, useForm } from 'react-hook-form'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@/test/utils/render'
import { NumberInputField } from './NumberInputField'

describe('NumberInputField', () => {
    it('labels the number input and links descriptions and errors', () => {
        render(
            <NumberInputField
                id="quantity"
                label="Quantity"
                description="Choose a value from zero to ten."
                error="Quantity is required."
                required
                min={0}
                max={10}
            />,
        )

        const input = screen.getByRole('textbox', { name: 'Quantity' })
        expect(input).toHaveAttribute('required')
        expect(input).toHaveAttribute('aria-invalid', 'true')
        expect(input).toHaveAttribute('aria-describedby', 'quantity-description quantity-error')
        expect(screen.getByRole('alert')).toHaveTextContent('Quantity is required.')
    })

    it('uses the primitive stepper and keyboard behavior', async () => {
        const user = userEvent.setup()
        render(
            <NumberInputField
                id="quantity"
                label="Quantity"
                defaultValue={2}
                min={0}
                max={10}
                step={2}
            />,
        )

        const input = screen.getByRole('textbox', { name: 'Quantity' })
        await user.click(screen.getByRole('button', { name: 'Increase Quantity' }))
        expect(input).toHaveValue('4')
        await user.click(input)
        await user.keyboard('{ArrowDown}')
        expect(input).toHaveValue('2')
    })

    it('supports RHF controlled values and disabled steppers', async () => {
        const user = userEvent.setup()
        const onSubmit = vi.fn()

        function NumberForm() {
            const { control, handleSubmit } = useForm({ defaultValues: { quantity: 3 } })
            return (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        name="quantity"
                        control={control}
                        render={({ field }) => (
                            <NumberInputField
                                id="quantity"
                                label="Quantity"
                                min={0}
                                max={10}
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

        render(<NumberForm />)
        await user.click(screen.getByRole('button', { name: 'Increase Quantity' }))
        await user.click(screen.getByRole('button', { name: 'Save' }))
        expect(onSubmit).toHaveBeenCalledWith({ quantity: 4 }, expect.anything())

        render(<NumberInputField id="locked" label="Locked" disabled />)
        expect(screen.getByRole('textbox', { name: 'Locked' })).toBeDisabled()
        expect(screen.getByRole('button', { name: 'Increase Locked' })).toBeDisabled()
    })
})
