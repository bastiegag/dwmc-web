import { describe, it, expect, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useQueryClient } from '@tanstack/react-query'
import { http, HttpResponse } from 'msw'
import { render, renderMonthAwareNavigation } from '@/test/utils/render'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { MonthNavigator } from '@/shared/month'
import { server } from '@/test/mocks/server'
import { dashboardQueryKeys } from '@/features/dashboard/hooks/use-monthly-summary'
import { PrimaryActionButton } from '@/shared/primary-action'

const RefreshDashboardSummary = () => {
    const queryClient = useQueryClient()

    return (
        <button
            type="button"
            onClick={() => void queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.all })}
        >
            Refresh dashboard summary
        </button>
    )
}

describe('DashboardPage', () => {
    beforeEach(() => {
        // Ensure apiClient uses the test API URL that MSW uses
        vi.stubEnv('VITE_API_URL', 'http://localhost:8787')
    })

    it('renders heading and loading state', () => {
        render(<DashboardPage />)
        expect(screen.getByRole('heading', { name: /dashboard/i, level: 1 })).toBeInTheDocument()
        expect(screen.getByRole('status')).toHaveTextContent(/loading summary/i)
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

    it('shows an error state when the summary request fails and retries successfully', async () => {
        const user = userEvent.setup()
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
        server.resetHandlers()
        await user.click(screen.getByRole('button', { name: 'Retry' }))
        expect(
            await screen.findByRole('heading', { name: /income/i, level: 2 }),
        ).toBeInTheDocument()
    })

    it('announces transaction option loading inside the open transaction dialog', async () => {
        const user = userEvent.setup()
        let finishAccountsResponse: () => void = () => {}
        const accountsResponse = new Promise<void>((resolve) => {
            finishAccountsResponse = resolve
        })
        server.use(
            http.get('http://localhost:8787/accounts*', async () => {
                await accountsResponse
                return HttpResponse.json({ data: [] })
            }),
        )

        render(
            <>
                <DashboardPage />
                <PrimaryActionButton />
            </>,
        )

        await user.click(await screen.findByTestId('primary-action-button'))
        expect(await screen.findByText('Loading transaction options...')).toBeInTheDocument()

        finishAccountsResponse()
        await waitFor(() =>
            expect(screen.queryByText('Loading transaction options...')).not.toBeInTheDocument(),
        )
    })

    it('shows and retries account-option errors from the transaction dialog', async () => {
        const user = userEvent.setup()
        let requestCount = 0
        server.use(
            http.get('http://localhost:8787/accounts*', () => {
                requestCount += 1
                if (requestCount === 1) {
                    return HttpResponse.json(
                        { error: { message: 'Accounts unavailable' } },
                        { status: 500 },
                    )
                }
                return HttpResponse.json({ data: [] })
            }),
        )

        render(
            <>
                <DashboardPage />
                <PrimaryActionButton />
            </>,
        )

        await user.click(await screen.findByTestId('primary-action-button'))
        expect(await screen.findByText('Accounts unavailable')).toBeInTheDocument()
        expect(screen.getByRole('dialog', { name: 'New Transaction' })).toBeInTheDocument()

        await user.click(screen.getByRole('button', { name: 'Retry accounts' }))
        await waitFor(() =>
            expect(screen.queryByText('Accounts unavailable')).not.toBeInTheDocument(),
        )
        expect(requestCount).toBe(2)
    })

    it('keeps visible summary data when a background refresh fails', async () => {
        const user = userEvent.setup()
        render(
            <>
                <DashboardPage />
                <RefreshDashboardSummary />
            </>,
            { initialEntries: ['/dashboard?month=2026-06'] },
        )

        expect(await screen.findByText('23')).toBeInTheDocument()

        server.use(
            http.get('http://localhost:8787/summary/monthly*', () =>
                HttpResponse.json(
                    { error: { code: 'INTERNAL_SERVER_ERROR', message: 'Summary unavailable' } },
                    { status: 500 },
                ),
            ),
        )
        await user.click(screen.getByRole('button', { name: 'Refresh dashboard summary' }))

        expect(await screen.findByText('Summary unavailable')).toBeInTheDocument()
        expect(screen.getByRole('heading', { name: /income/i, level: 2 })).toBeInTheDocument()
        expect(screen.getByText('23')).toBeInTheDocument()
        expect(screen.getByRole('status')).toHaveTextContent(/summary refresh failed/i)
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
