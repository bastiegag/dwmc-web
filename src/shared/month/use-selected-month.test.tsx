import { describe, expect, it, vi } from 'vitest'
import { fireEvent, screen } from '@testing-library/react'
import { useLocation } from 'react-router-dom'
import { useSelectedMonth } from '@/shared/month'
import { render } from '@/test/utils/render'

const MonthProbe = ({ includeInvalidSetter = false }: { includeInvalidSetter?: boolean }) => {
    const { month, setMonth, goToPreviousMonth, goToNextMonth } = useSelectedMonth()
    const location = useLocation()

    return (
        <>
            <output data-testid="selected-month">{month}</output>
            <output data-testid="location">
                {location.pathname}
                {location.search}
            </output>
            <button onClick={goToPreviousMonth}>Previous</button>
            <button onClick={goToNextMonth}>Next</button>
            {includeInvalidSetter ? (
                <button onClick={() => setMonth('not-a-month')}>Invalid</button>
            ) : null}
        </>
    )
}

describe('useSelectedMonth', () => {
    it.each([
        '/dashboard',
        '/dashboard?month=',
        '/dashboard?month=2026-6',
        '/dashboard?month=2026-13',
    ])('falls back to the current month for %s', (initialEntry) => {
        vi.useFakeTimers()
        vi.setSystemTime(new Date('2026-08-10T12:00:00.000Z'))

        render(<MonthProbe />, { initialEntries: [initialEntry] })
        expect(screen.getByTestId('selected-month')).toHaveTextContent('2026-08')
    })

    it('navigates rollover months while preserving unrelated query parameters', () => {
        render(<MonthProbe />, { initialEntries: ['/dashboard?month=2026-01&view=summary'] })

        fireEvent.click(screen.getByRole('button', { name: 'Previous' }))

        expect(screen.getByTestId('selected-month')).toHaveTextContent('2025-12')
        expect(screen.getByTestId('location')).toHaveTextContent(
            '/dashboard?month=2025-12&view=summary',
        )
    })

    it('ignores invalid month updates', () => {
        render(<MonthProbe includeInvalidSetter />, {
            initialEntries: ['/dashboard?month=2026-08'],
        })

        fireEvent.click(screen.getByRole('button', { name: 'Invalid' }))

        expect(screen.getByTestId('location')).toHaveTextContent('/dashboard?month=2026-08')
    })
})
