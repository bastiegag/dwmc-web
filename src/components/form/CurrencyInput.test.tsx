import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CurrencyInput } from './CurrencyInput'

describe('CurrencyInput', () => {
    it('keeps empty and zero distinct', async () => {
        const user = userEvent.setup()
        const onValueChange = vi.fn()
        render(<CurrencyInput label="Amount" onValueChange={onValueChange} />)
        const input = screen.getByLabelText('Amount')
        await user.type(input, '0')
        expect(onValueChange).toHaveBeenLastCalledWith('0')
        await user.clear(input)
        expect(onValueChange).toHaveBeenLastCalledWith(null)
    })

    it('rejects precision beyond two decimal places without truncating', async () => {
        const user = userEvent.setup()
        const onValueChange = vi.fn()
        render(<CurrencyInput label="Amount" onValueChange={onValueChange} />)
        await user.type(screen.getByLabelText('Amount'), '1.234')
        expect(onValueChange).toHaveBeenLastCalledWith('1.23')
    })
})
