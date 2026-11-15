import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './Select'

describe('Select', () => {
    it('supports keyboard selection and reports the chosen value', async () => {
        const user = userEvent.setup()
        const onValueChange = vi.fn()

        render(
            <Select onValueChange={onValueChange}>
                <SelectTrigger aria-label="Account">
                    <SelectValue placeholder="Choose an account" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="checking">Checking</SelectItem>
                    <SelectItem value="savings">Savings</SelectItem>
                </SelectContent>
            </Select>,
        )

        await user.click(screen.getByRole('combobox', { name: 'Account' }))
        expect(await screen.findByRole('listbox')).toBeInTheDocument()
        await user.keyboard('{ArrowDown}{Enter}')

        await waitFor(() =>
            expect(onValueChange).toHaveBeenLastCalledWith('checking', expect.anything()),
        )
    })
})
