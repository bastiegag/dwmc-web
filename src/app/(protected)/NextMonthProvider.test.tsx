import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { NextMonthProvider } from './NextMonthProvider'
import { useSelectedMonth } from '@/shared/month'

const replaceMock = vi.fn()
let searchParams = new URLSearchParams('month=2026-06&view=summary')

vi.mock('next/navigation', () => ({
    usePathname: () => '/dashboard',
    useRouter: () => ({ replace: replaceMock }),
    useSearchParams: () => searchParams,
}))

function MonthProbe() {
    const { month, setMonth, goToPreviousMonth, goToNextMonth } = useSelectedMonth()

    return (
        <>
            <output data-testid="month">{month}</output>
            <button onClick={() => setMonth('2026-07')}>Set month</button>
            <button onClick={() => setMonth('invalid')}>Set invalid month</button>
            <button onClick={goToPreviousMonth}>Previous</button>
            <button onClick={goToNextMonth}>Next</button>
        </>
    )
}

describe('NextMonthProvider', () => {
    it('reads the month and preserves unrelated query parameters when replacing it', () => {
        replaceMock.mockReset()
        searchParams = new URLSearchParams('month=2026-06&view=summary')

        render(
            <NextMonthProvider>
                <MonthProbe />
            </NextMonthProvider>,
        )

        expect(screen.getByTestId('month')).toHaveTextContent('2026-06')
        fireEvent.click(screen.getByRole('button', { name: 'Next' }))
        expect(replaceMock).toHaveBeenCalledWith('/dashboard?month=2026-07&view=summary')
    })

    it('falls back for invalid values and ignores invalid updates', () => {
        replaceMock.mockReset()
        searchParams = new URLSearchParams('month=2026-13')

        render(
            <NextMonthProvider>
                <MonthProbe />
            </NextMonthProvider>,
        )

        expect(screen.getByTestId('month')).toHaveTextContent(new Date().toISOString().slice(0, 7))
        fireEvent.click(screen.getByRole('button', { name: 'Set invalid month' }))
        expect(replaceMock).not.toHaveBeenCalled()
    })
})
