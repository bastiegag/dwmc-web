import { describe, it, expect, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { render, renderMonthAwareNavigation } from '@/test/utils/render'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { MonthNavigator } from '@/shared/month'
import { server } from '@/test/mocks/server'

describe('DashboardPage', () => {
    beforeEach(() => {
        // Ensure apiClient uses the test API URL that MSW uses
        vi.stubEnv('VITE_API_URL', 'http://localhost:8787')
    })

    it('renders heading and loading state', () => {
        render(<DashboardPage />)
        expect(screen.getByRole('heading', { name: /dashboard/i, level: 1 })).toBeInTheDocument()
        expect(screen.getByLabelText(/loading summary/i)).toBeInTheDocument()
    })

    it('shows summary cards when data is present', async () => {
        render(<DashboardPage />, { initialEntries: ['/dashboard?month=2026-06'] })
        expect(
            await screen.findByRole('heading', { name: /income/i, level: 2 }),
        ).toBeInTheDocument()
        expect(screen.getByRole('heading', { name: /expenses/i, level: 2 })).toBeInTheDocument()
        expect(screen.getByRole('heading', { name: /net/i, level: 2 })).toBeInTheDocument()
        expect(screen.getAllByText(/5.*000,00/)).toHaveLength(2)
        expect(screen.getByText(/3.*200,00/)).toBeInTheDocument()
        expect(screen.getByText(/1.*800,00/)).toBeInTheDocument()
        expect(screen.getByText('23')).toBeInTheDocument()
        expect(screen.getByText('Groceries')).toBeInTheDocument()
        expect(screen.getByText('Grocery Store')).toBeInTheDocument()
        expect(screen.getByRole('link', { name: /view all transactions/i })).toHaveAttribute(
            'href',
            '/transactions?month=2026-06',
        )
    })

    it('shows the empty state for a month with no activity', async () => {
        render(<DashboardPage />, { initialEntries: ['/dashboard?month=2026-02'] })

        expect(
            await screen.findByRole('heading', { name: /no activity this month/i }),
        ).toBeInTheDocument()
        expect(screen.queryByRole('heading', { name: /income/i, level: 2 })).not.toBeInTheDocument()
    })

    it('shows an error state when the summary request fails', async () => {
        server.use(
            http.get('http://localhost:8787/summary/monthly*', () =>
                HttpResponse.json(
                    { error: { code: 'INTERNAL_SERVER_ERROR', message: 'Summary unavailable' } },
                    { status: 500 },
                ),
            ),
        )

        render(<DashboardPage />)

        expect(await screen.findByText('Summary unavailable')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument()
    })

    it('requests the newly selected month when the shared navigator changes month', async () => {
        const user = userEvent.setup()
        renderMonthAwareNavigation(
            <>
                <MonthNavigator />
                <DashboardPage />
            </>,
            '2026-06',
        )

        await screen.findByRole('heading', { name: /income/i, level: 2 })
        await user.click(screen.getByRole('button', { name: 'Go to next month' }))

        expect(screen.getByTestId('location-probe')).toHaveTextContent('/dashboard?month=2026-07')
        expect(await screen.findByText('23')).toBeInTheDocument()
    })
})
