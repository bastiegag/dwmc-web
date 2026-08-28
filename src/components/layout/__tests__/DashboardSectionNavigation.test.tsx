import { describe, expect, it } from 'vitest'
import userEvent from '@testing-library/user-event'
import { DashboardSectionNavigation } from '@/components/layout/DashboardSectionNavigation'
import { renderMonthAwareNavigation, screen } from '@/test/utils/render'

describe('DashboardSectionNavigation', () => {
    it('exposes Overview and Transactions and preserves the selected month', async () => {
        const user = userEvent.setup()

        renderMonthAwareNavigation(<DashboardSectionNavigation />, '2026-08')

        expect(screen.getByRole('link', { name: 'Overview' })).toHaveAttribute(
            'aria-current',
            'page',
        )
        expect(screen.getByRole('link', { name: 'Transactions' })).not.toHaveAttribute(
            'aria-current',
        )

        await user.click(screen.getByRole('link', { name: 'Transactions' }))

        expect(screen.getByTestId('location-probe')).toHaveTextContent(
            '/transactions?month=2026-08',
        )
        expect(screen.getByRole('link', { name: 'Transactions' })).toHaveAttribute(
            'aria-current',
            'page',
        )
    })
})
