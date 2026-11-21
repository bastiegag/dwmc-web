import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { RadioGroup, RadioGroupItem } from './RadioGroup'

const options = (
    <>
        <RadioGroupItem value="monthly" aria-label="Monthly" />
        <RadioGroupItem value="yearly" aria-label="Yearly" />
    </>
)

describe('RadioGroup', () => {
    it('defaults to vertical layout and supports uncontrolled selection and keyboard navigation', async () => {
        const user = userEvent.setup()
        render(
            <RadioGroup aria-label="Budget period" defaultValue="monthly">
                {options}
            </RadioGroup>,
        )

        const group = screen.getByRole('radiogroup', { name: 'Budget period' })
        expect(group).toHaveAttribute('aria-orientation', 'vertical')
        expect(group).toHaveClass('flex', 'flex-col', 'gap-3')
        expect(group).not.toHaveClass('flex-row', 'flex-wrap')

        const monthly = screen.getByRole('radio', { name: 'Monthly' })
        const yearly = screen.getByRole('radio', { name: 'Yearly' })

        expect(monthly).toBeChecked()
        await user.click(yearly)
        expect(yearly).toBeChecked()
        await user.keyboard('{ArrowLeft}')
        expect(monthly).toBeChecked()
    })

    it('supports horizontal layout, accessible orientation, and custom classes', async () => {
        const user = userEvent.setup()
        render(
            <RadioGroup
                aria-label="Budget period"
                orientation="horizontal"
                defaultValue="monthly"
                className="max-w-sm"
            >
                {options}
            </RadioGroup>,
        )

        const group = screen.getByRole('radiogroup', { name: 'Budget period' })
        expect(group).toHaveAttribute('aria-orientation', 'horizontal')
        expect(group).toHaveClass('flex', 'flex-row', 'flex-wrap', 'gap-3', 'max-w-sm')
        expect(group).not.toHaveClass('flex-col')
        expect(group).not.toHaveAttribute('orientation')

        await user.click(screen.getByRole('radio', { name: 'Yearly' }))
        expect(screen.getByRole('radio', { name: 'Yearly' })).toBeChecked()
    })

    it('uses the explicit aria orientation as a layout fallback', () => {
        render(
            <RadioGroup aria-label="Budget period" aria-orientation="horizontal">
                {options}
            </RadioGroup>,
        )

        const group = screen.getByRole('radiogroup', { name: 'Budget period' })
        expect(group).toHaveAttribute('aria-orientation', 'horizontal')
        expect(group).toHaveClass('flex-row', 'flex-wrap')
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
        expect(screen.getByRole('radio', { name: 'Yearly' })).toBeDisabled()
    })
})
