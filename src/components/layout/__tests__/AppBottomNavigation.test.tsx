import { useLocation } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@/test/utils/render'
import { AppBottomNavigation } from '@/components/layout/AppBottomNavigation'

const LocationProbe = () => {
    const location = useLocation()

    return (
        <output data-testid="location-probe">
            {location.pathname}
            {location.search}
        </output>
    )
}

describe('AppBottomNavigation', () => {
    beforeEach(() => {
        vi.stubEnv('VITE_API_URL', 'http://localhost:8787')
    })

    it('preserves the selected month when navigating between screens', async () => {
        const user = userEvent.setup()

        render(
            <>
                <AppBottomNavigation />
                <LocationProbe />
            </>,
            { initialEntries: ['/dashboard?month=2026-06'] },
        )

        expect(screen.getByTestId('location-probe')).toHaveTextContent('/dashboard?month=2026-06')

        await user.click(screen.getByRole('link', { name: /budgets/i }))

        expect(screen.getByTestId('location-probe')).toHaveTextContent('/budgets?month=2026-06')
    })
})
