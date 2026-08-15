import { beforeEach, describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { renderMonthAwareNavigation, screen } from '@/test/utils/render'
import { AppBottomNavigation } from '@/components/layout/AppBottomNavigation'

describe('AppBottomNavigation', () => {
    beforeEach(() => {
        vi.stubEnv('VITE_API_URL', 'http://localhost:8787')
    })

    it('preserves the selected month when navigating between screens', async () => {
        const user = userEvent.setup()

        renderMonthAwareNavigation(<AppBottomNavigation />, '2026-06')

        expect(screen.getByTestId('location-probe')).toHaveTextContent('/dashboard?month=2026-06')

        await user.click(screen.getByRole('link', { name: /budgets/i }))

        expect(screen.getByTestId('location-probe')).toHaveTextContent('/budgets?month=2026-06')

        await user.click(screen.getByRole('link', { name: /transactions/i }))

        expect(screen.getByTestId('location-probe')).toHaveTextContent(
            '/transactions?month=2026-06',
        )
    })

    it('marks Transactions active on the selected route', () => {
        renderMonthAwareNavigation(<AppBottomNavigation />, '2026-06', '/transactions')

        expect(screen.getByRole('link', { name: /transactions/i })).toHaveAttribute(
            'aria-current',
            'page',
        )
    })
})
