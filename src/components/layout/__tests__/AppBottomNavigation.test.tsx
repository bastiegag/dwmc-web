import { beforeEach, describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { renderMonthAwareNavigation, screen } from '@/test/utils/render'
import { AppBottomNavigation } from '@/components/layout/AppBottomNavigation'

describe('AppBottomNavigation', () => {
    beforeEach(() => {
        vi.stubEnv('VITE_API_URL', 'http://localhost:8787')
    })

    it('contains four global destinations and preserves the selected month', async () => {
        const user = userEvent.setup()

        renderMonthAwareNavigation(<AppBottomNavigation />, '2026-06')

        expect(screen.getAllByRole('link')).toHaveLength(4)
        expect(screen.queryByRole('link', { name: 'Transactions' })).not.toBeInTheDocument()
        expect(screen.getByTestId('location-probe')).toHaveTextContent('/dashboard?month=2026-06')

        await user.click(screen.getByRole('link', { name: /budgets/i }))

        expect(screen.getByTestId('location-probe')).toHaveTextContent('/budgets?month=2026-06')
    })

    it('keeps Overview active for the Dashboard section on the Transactions route', () => {
        renderMonthAwareNavigation(<AppBottomNavigation />, '2026-06', '/transactions')

        expect(screen.getByRole('link', { name: /overview/i })).toHaveAttribute(
            'aria-current',
            'page',
        )
    })
})
