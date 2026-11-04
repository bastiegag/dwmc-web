import { beforeEach, describe, expect, it, vi } from 'vitest'
import { http, HttpResponse } from 'msw'
import { useMonthlySummary } from '@/features/dashboard/hooks/use-monthly-summary'
import { useTransactions } from '@/features/transactions/hooks/use-transactions'
import { useBudgets } from '@/features/budgets/hooks/use-budgets'
import { useSelectedMonth } from '@/shared/month'
import { render, screen, waitFor } from '@/test/utils/render'
import { server } from '@/test/mocks/server'
import userEvent from '@testing-library/user-event'

const API_URL = 'http://localhost:8787'

type Deferred<T> = {
    promise: Promise<T>
    resolve: (value: T) => void
}

const createDeferred = <T,>(): Deferred<T> => {
    let resolve!: (value: T) => void
    const promise = new Promise<T>((nextResolve) => {
        resolve = nextResolve
    })
    return { promise, resolve }
}

const MonthQueriesProbe = () => {
    const { month, goToNextMonth } = useSelectedMonth()
    const summary = useMonthlySummary({ month, recentLimit: 5 })
    const transactions = useTransactions({ month })
    const budgets = useBudgets({ month })

    return (
        <>
            <button onClick={goToNextMonth}>Next month</button>
            <output data-testid="selected-month">{month}</output>
            <output data-testid="dashboard-month">{summary.data?.month ?? ''}</output>
            <output data-testid="transactions-month">
                {transactions.data?.data[0]?.merchant ?? ''}
            </output>
            <output data-testid="budgets-month">{budgets.data?.[0]?.month ?? ''}</output>
        </>
    )
}

describe('month query race conditions', () => {
    beforeEach(() => {
        vi.stubEnv('VITE_API_URL', API_URL)
    })

    it('keeps the current month authoritative when older responses arrive late', async () => {
        const deferredByMonth = new Map<string, Deferred<Response>>()
        server.use(
            http.get(`${API_URL}/summary/monthly*`, ({ request }) => {
                const month = new URL(request.url).searchParams.get('month')!
                const deferred = createDeferred<Response>()
                deferredByMonth.set(`dashboard-${month}`, deferred)
                return deferred.promise.then((response) => response)
            }),
            http.get(`${API_URL}/transactions*`, ({ request }) => {
                const month = new URL(request.url).searchParams.get('month')!
                const deferred = createDeferred<Response>()
                deferredByMonth.set(`transactions-${month}`, deferred)
                return deferred.promise.then((response) => response)
            }),
            http.get(`${API_URL}/budgets*`, ({ request }) => {
                const month = new URL(request.url).searchParams.get('month')!
                const deferred = createDeferred<Response>()
                deferredByMonth.set(`budgets-${month}`, deferred)
                return deferred.promise.then((response) => response)
            }),
        )

        const user = userEvent.setup()
        render(<MonthQueriesProbe />, { initialEntries: ['/dashboard?month=2026-05'] })
        await waitFor(() => expect(deferredByMonth.size).toBe(3))

        await user.click(screen.getByRole('button', { name: 'Next month' }))
        await waitFor(() => expect(deferredByMonth.size).toBe(6))

        await user.click(screen.getByRole('button', { name: 'Next month' }))
        await waitFor(() => expect(deferredByMonth.size).toBe(9))

        for (const key of ['dashboard-2026-07', 'transactions-2026-07', 'budgets-2026-07']) {
            const month = key.slice(-7)
            deferredByMonth
                .get(key)!
                .resolve(
                    HttpResponse.json(
                        key.startsWith('dashboard')
                            ? { data: { month, totals: { transactionCount: 0 } } }
                            : key.startsWith('transactions')
                              ? { data: [{ merchant: month }], meta: {} }
                              : { data: [{ month }], meta: {} },
                    ) as unknown as Response,
                )
        }

        await waitFor(() => {
            expect(screen.getByTestId('selected-month')).toHaveTextContent('2026-07')
            expect(screen.getByTestId('dashboard-month')).toHaveTextContent('2026-07')
            expect(screen.getByTestId('transactions-month')).toHaveTextContent('2026-07')
            expect(screen.getByTestId('budgets-month')).toHaveTextContent('2026-07')
        })

        for (const key of [
            'dashboard-2026-06',
            'transactions-2026-06',
            'budgets-2026-06',
            'dashboard-2026-05',
            'transactions-2026-05',
            'budgets-2026-05',
        ]) {
            const month = key.slice(-7)
            deferredByMonth
                .get(key)!
                .resolve(
                    HttpResponse.json(
                        key.startsWith('dashboard')
                            ? { data: { month, totals: { transactionCount: 0 } } }
                            : key.startsWith('transactions')
                              ? { data: [{ merchant: month }], meta: {} }
                              : { data: [{ month }], meta: {} },
                    ) as unknown as Response,
                )
        }

        await waitFor(() => {
            expect(screen.getByTestId('selected-month')).toHaveTextContent('2026-07')
            expect(screen.getByTestId('dashboard-month')).toHaveTextContent('2026-07')
            expect(screen.getByTestId('transactions-month')).toHaveTextContent('2026-07')
            expect(screen.getByTestId('budgets-month')).toHaveTextContent('2026-07')
        })
    })
})
