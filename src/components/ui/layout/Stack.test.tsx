import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { render, screen } from '@/test/utils/render'
import { Stack } from './Stack'

describe('Stack', () => {
    it('defaults to a vertical stack with gap 4 and no wrapping', () => {
        render(<Stack data-testid="stack" />)

        expect(screen.getByTestId('stack')).toHaveClass('flex', 'flex-col', 'gap-4', 'flex-nowrap')
    })

    it('supports horizontal direction and configured spacing', () => {
        render(<Stack data-testid="stack" direction="horizontal" gap={6} />)

        expect(screen.getByTestId('stack')).toHaveClass('flex-row', 'gap-6')
        expect(screen.getByTestId('stack')).not.toHaveClass('flex-col')
        expect(screen.getByTestId('stack')).not.toHaveClass('gap-4')
    })

    it('supports alignment and justification', () => {
        render(<Stack data-testid="stack" align="baseline" justify="between" />)

        expect(screen.getByTestId('stack')).toHaveClass('items-baseline', 'justify-between')
    })

    it('supports wrapping', () => {
        render(<Stack data-testid="stack" wrap />)

        expect(screen.getByTestId('stack')).toHaveClass('flex-wrap')
        expect(screen.getByTestId('stack')).not.toHaveClass('flex-nowrap')
    })

    it('merges layout overrides, including responsive classes', () => {
        render(<Stack data-testid="stack" className="flex-row gap-2 sm:flex-col sm:gap-6" />)

        const stack = screen.getByTestId('stack')
        expect(stack).toHaveClass('flex-row', 'gap-2', 'sm:flex-col', 'sm:gap-6')
        expect(stack).not.toHaveClass('flex-col')
        expect(stack).not.toHaveClass('gap-4')
    })

    it('forwards refs and native div attributes', () => {
        const ref = createRef<HTMLDivElement>()

        render(
            <Stack ref={ref} id="account-stack" aria-label="Accounts" title="Account list">
                Checking
            </Stack>,
        )

        const stack = screen.getByLabelText('Accounts')
        expect(stack.tagName).toBe('DIV')
        expect(stack).toHaveAttribute('id', 'account-stack')
        expect(stack).toHaveAttribute('title', 'Account list')
        expect(stack).toHaveTextContent('Checking')
        expect(ref.current).toBe(stack)
    })
})
