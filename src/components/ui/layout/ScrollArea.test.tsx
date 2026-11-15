import { describe, expect, it } from 'vitest'
import { render, screen } from '@/test/utils/render'
import { ScrollArea } from './ScrollArea'

describe('ScrollArea', () => {
    it('does not add a tab stop unless requested', () => {
        render(<ScrollArea aria-label="Transactions" />)

        expect(screen.getByLabelText('Transactions')).not.toHaveAttribute('tabindex')
    })

    it('supports an explicit keyboard-focusable scrolling region', () => {
        render(<ScrollArea aria-label="Transactions" tabIndex={0} />)

        expect(screen.getByLabelText('Transactions')).toHaveAttribute('tabindex', '0')
    })
})
