import { useLocation } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@/test/utils/render'
import { DesktopSidebar } from '@/components/layout/DesktopSidebar'

const LocationProbe = () => {
    const location = useLocation()

    return (
        <output data-testid="location-probe">
            {location.pathname}
            {location.search}
        </output>
    )
}

describe('DesktopSidebar', () => {
    beforeEach(() => {
        vi.stubEnv('VITE_API_URL', 'http://localhost:8787')
    })

    it('preserves the selected month when navigating from the sidebar', async () => {
        const user = userEvent.setup()

        render(
            <>
                <DesktopSidebar />
                <LocationProbe />
            </>,
            { initialEntries: ['/dashboard?month=2026-07'] },
        )

        expect(screen.getByTestId('location-probe')).toHaveTextContent('/dashboard?month=2026-07')

        await user.click(screen.getByRole('link', { name: /transactions/i }))

        expect(screen.getByTestId('location-probe')).toHaveTextContent(
            '/transactions?month=2026-07',
        )
    })
})
