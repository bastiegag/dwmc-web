import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@/test/utils/render'
import { ColorPicker } from './ColorPicker'

describe('ColorPicker', () => {
    it('exposes semantic color choices and reports the selected value', async () => {
        const user = userEvent.setup()
        const onValueChange = vi.fn()

        render(
            <ColorPicker
                value="primary"
                onValueChange={onValueChange}
                required
                invalid
                aria-describedby="color-error"
            />,
        )

        const group = screen.getByRole('radiogroup', { name: 'Color' })
        expect(group).toHaveAttribute('aria-required', 'true')
        expect(group).toHaveAttribute('aria-invalid', 'true')
        expect(group).toHaveAttribute('aria-describedby', 'color-error')
        expect(screen.getAllByRole('radio')).toHaveLength(6)
        const primary = screen.getByRole('radio', { name: 'Primary color' })
        expect(primary).toBeChecked()
        expect(primary.querySelector('[aria-hidden="true"]')).toBeNull()
        expect(primary).toHaveClass('data-checked:border-background')
        expect(primary).not.toHaveClass('data-checked:ring-2')

        await user.click(screen.getByRole('radio', { name: 'Warning color' }))
        expect(onValueChange).toHaveBeenCalledWith('warning')
    })

    it('supports arrow-key navigation and disabled choices', async () => {
        const user = userEvent.setup()
        const onValueChange = vi.fn()

        const { rerender } = render(<ColorPicker value="primary" onValueChange={onValueChange} />)
        await user.tab()
        expect(screen.getByRole('radio', { name: 'Primary color' })).toHaveFocus()
        await user.keyboard('{ArrowRight}')
        expect(onValueChange).toHaveBeenLastCalledWith('secondary')

        rerender(<ColorPicker value="primary" onValueChange={onValueChange} disabled />)
        expect(screen.getByRole('radio', { name: 'Primary color' })).toBeDisabled()
    })
})
