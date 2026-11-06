import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'
import {
    NumberField,
    NumberFieldDecrement,
    NumberFieldGroup,
    NumberFieldIncrement,
    NumberFieldInput,
} from './number-field'

const renderNumberField = (props: React.ComponentProps<typeof NumberField>) =>
    render(
        <NumberField {...props}>
            <NumberFieldGroup>
                <NumberFieldDecrement aria-label="Decrease quantity" />
                <NumberFieldInput aria-label="Quantity" />
                <NumberFieldIncrement aria-label="Increase quantity" />
            </NumberFieldGroup>
        </NumberField>,
    )

const quantityInput = () => screen.getByRole('textbox', { name: 'Quantity' })

describe('NumberField', () => {
    it('increments and decrements with the stepper buttons by the step size', async () => {
        const user = userEvent.setup()
        renderNumberField({ defaultValue: 2, step: 2 })

        await user.click(screen.getByRole('button', { name: 'Increase quantity' }))
        expect(quantityInput()).toHaveValue('4')

        await user.click(screen.getByRole('button', { name: 'Decrease quantity' }))
        expect(quantityInput()).toHaveValue('2')
    })

    it('respects min and max when stepping', async () => {
        const user = userEvent.setup()
        renderNumberField({ defaultValue: 9, min: 0, max: 10 })

        await user.click(screen.getByRole('button', { name: 'Increase quantity' }))
        await user.click(screen.getByRole('button', { name: 'Increase quantity' }))
        expect(quantityInput()).toHaveValue('10')
        expect(screen.getByRole('button', { name: 'Increase quantity' })).toBeDisabled()

        await user.click(screen.getByRole('button', { name: 'Decrease quantity' }))
        expect(quantityInput()).toHaveValue('9')
    })

    it('supports keyboard arrow keys to step the value', async () => {
        const user = userEvent.setup()
        renderNumberField({ defaultValue: 5 })

        await user.click(quantityInput())
        await user.keyboard('{ArrowUp}')
        expect(quantityInput()).toHaveValue('6')
        await user.keyboard('{ArrowDown}')
        expect(quantityInput()).toHaveValue('5')
    })

    it('disables the input and steppers', () => {
        renderNumberField({ defaultValue: 4, disabled: true })

        expect(quantityInput()).toBeDisabled()
        expect(screen.getByRole('button', { name: 'Increase quantity' })).toBeDisabled()
        expect(screen.getByRole('button', { name: 'Decrease quantity' })).toBeDisabled()
    })

    it('supports controlled values', async () => {
        const user = userEvent.setup()
        const onValueChange = vi.fn()
        const Controlled = () => {
            const [value, setValue] = React.useState<number | null>(3)
            return (
                <NumberField
                    value={value}
                    onValueChange={(next) => {
                        onValueChange(next)
                        setValue(next)
                    }}
                >
                    <NumberFieldGroup>
                        <NumberFieldDecrement aria-label="Decrease quantity" />
                        <NumberFieldInput aria-label="Quantity" />
                        <NumberFieldIncrement aria-label="Increase quantity" />
                    </NumberFieldGroup>
                </NumberField>
            )
        }
        render(<Controlled />)

        await user.click(screen.getByRole('button', { name: 'Increase quantity' }))
        expect(onValueChange).toHaveBeenLastCalledWith(4)
        expect(quantityInput()).toHaveValue('4')
    })

    it('has no detectable accessibility violations', async () => {
        const { container } = renderNumberField({ defaultValue: 2, min: 0, max: 10 })
        expect((await axe(container)).violations).toHaveLength(0)
    })
})
