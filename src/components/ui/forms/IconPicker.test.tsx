import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@/test/utils/render'
import { IconPicker } from './IconPicker'

describe('IconPicker', () => {
    it('exposes the shared icon registry as accessible choices', async () => {
        const user = userEvent.setup()
        const onValueChange = vi.fn()

        render(<IconPicker value="wallet" onValueChange={onValueChange} />)

        expect(screen.getAllByRole('radio')).toHaveLength(20)
        expect(screen.getByRole('radio', { name: 'Wallet' })).toBeChecked()
        await user.click(screen.getByRole('radio', { name: 'Dining' }))
        expect(onValueChange).toHaveBeenCalledWith('utensils')
    })

    it('supports arrow-key navigation and disables choices when requested', async () => {
        const user = userEvent.setup()
        const onValueChange = vi.fn()

        const { rerender } = render(<IconPicker value="wallet" onValueChange={onValueChange} />)
        await user.tab()
        expect(screen.getByRole('radio', { name: 'Wallet' })).toHaveFocus()
        await user.keyboard('{ArrowRight}')
        expect(onValueChange).toHaveBeenLastCalledWith('landmark')

        rerender(<IconPicker value="wallet" onValueChange={onValueChange} disabled />)
        expect(screen.getByRole('radio', { name: 'Wallet' })).toBeDisabled()
    })
})
