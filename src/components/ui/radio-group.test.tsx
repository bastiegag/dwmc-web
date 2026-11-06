import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { RadioGroup, RadioGroupItem } from './radio-group'

const options = (
    <>
        <RadioGroupItem value="monthly" aria-label="Monthly" />
        <RadioGroupItem value="yearly" aria-label="Yearly" />
    </>
)

describe('RadioGroup', () => {
    it('supports uncontrolled selection and keyboard navigation', async () => {
        const user = userEvent.setup()
        render(<RadioGroup defaultValue="monthly">{options}</RadioGroup>)

        const monthly = screen.getByRole('radio', { name: 'Monthly' })
        const yearly = screen.getByRole('radio', { name: 'Yearly' })

        expect(monthly).toBeChecked()
        await user.click(yearly)
        expect(yearly).toBeChecked()
        await user.keyboard('{ArrowLeft}')
        expect(monthly).toBeChecked()
    })

    it('supports controlled values and the compatibility callback', async () => {
        const user = userEvent.setup()
        const onValueChange = vi.fn()
        const Controlled = () => {
            const [value, setValue] = React.useState('monthly')
            return (
                <RadioGroup
                    value={value}
                    onValueChange={(nextValue) => {
                        onValueChange(nextValue)
                        setValue(nextValue)
                    }}
                >
                    {options}
                </RadioGroup>
            )
        }

        render(<Controlled />)
        await user.click(screen.getByRole('radio', { name: 'Yearly' }))

        expect(onValueChange).toHaveBeenCalledWith('yearly')
        expect(screen.getByRole('radio', { name: 'Yearly' })).toBeChecked()
    })

    it('does not select disabled options', async () => {
        const user = userEvent.setup()
        render(
            <RadioGroup defaultValue="monthly">
                <RadioGroupItem value="monthly" aria-label="Monthly" />
                <RadioGroupItem value="yearly" aria-label="Yearly" disabled />
            </RadioGroup>,
        )

        await user.click(screen.getByRole('radio', { name: 'Yearly' }))
        expect(screen.getByRole('radio', { name: 'Monthly' })).toBeChecked()
        expect(screen.getByRole('radio', { name: 'Yearly' })).toHaveAttribute(
            'aria-disabled',
            'true',
        )
    })
})
