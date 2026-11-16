import { beforeEach, describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { useQueryClient } from '@tanstack/react-query'
import { http, HttpResponse } from 'msw'
import { render, screen } from '@/test/utils/render'
import { TransactionsPage } from '@/features/transactions/pages/TransactionsPage'
import { PrimaryActionButton } from '@/shared/primary-action'
import { formatLocalDate } from '@/shared/date'
import { server } from '@/test/mocks/server'
import { createTransaction } from '@/test/fixtures/domain'
import { transactionQueryKeys } from '@/features/transactions/hooks/use-transactions'

const RefreshTransactions = () => {
    const queryClient = useQueryClient()

    return (
        <button
            type="button"
            onClick={() =>
                void queryClient.invalidateQueries({ queryKey: transactionQueryKeys.lists() })
            }
        >
            Refresh transactions
        </button>
    )
}

describe('TransactionsPage', () => {
    beforeEach(() => {
        vi.stubEnv('VITE_API_URL', 'http://localhost:8787')
        localStorage.clear()
    })

    it('opens a new transaction with the selected historical month date', async () => {
        const user = userEvent.setup()
        render(
            <>
                <TransactionsPage />
                <PrimaryActionButton />
            </>,
            { initialEntries: ['/transactions?month=2026-05'] },
        )

        await user.click(screen.getByTestId('primary-action-button'))

        expect(screen.getByLabelText(/Date/)).toHaveValue('2026-05-01')
    })

    it('defaults a new transaction to today for the current month', async () => {
        const user = userEvent.setup()
        const today = formatLocalDate()
        const currentMonth = today.slice(0, 7)

        render(
            <>
                <TransactionsPage />
                <PrimaryActionButton />
            </>,
            { initialEntries: [`/transactions?month=${currentMonth}`] },
        )

        await user.click(screen.getByTestId('primary-action-button'))

        expect(screen.getByLabelText(/Date/)).toHaveValue(today)
    })

    it('retries a failed transactions request', async () => {
        const user = userEvent.setup()
        let requestCount = 0
        server.use(
            http.get('http://localhost:8787/transactions*', () => {
                requestCount += 1
                if (requestCount === 1) {
                    return HttpResponse.json(
                        { error: { message: 'Transactions unavailable' } },
                        { status: 500 },
                    )
                }
                return HttpResponse.json({ data: [], meta: { page: 1, total: 0, totalPages: 0 } })
            }),
        )

        render(<TransactionsPage />)

        expect(await screen.findByText('Transactions unavailable')).toBeInTheDocument()
        await user.click(screen.getByRole('button', { name: 'Retry' }))

        expect(await screen.findByText('No transactions found')).toBeInTheDocument()
        expect(requestCount).toBe(2)
    })

    it('keeps visible transactions when a background refresh fails', async () => {
        const user = userEvent.setup()
        const transaction = createTransaction({
            id: 'cached-transaction',
            merchant: 'Cached transaction',
        })
        let requestCount = 0
        server.use(
            http.get('http://localhost:8787/transactions*', () => {
                requestCount += 1
                if (requestCount > 1) {
                    return HttpResponse.json(
                        { error: { message: 'Transactions refresh failed' } },
                        { status: 500 },
                    )
                }
                return HttpResponse.json({
                    data: [transaction],
                    meta: { page: 1, total: 1, totalPages: 1 },
                })
            }),
        )

        render(
            <>
                <TransactionsPage />
                <RefreshTransactions />
            </>,
            { initialEntries: ['/transactions?month=2026-06'] },
        )

        expect(await screen.findByText('Cached transaction')).toBeInTheDocument()
        await user.click(screen.getByRole('button', { name: 'Refresh transactions' }))

        expect(await screen.findByText('Transactions refresh failed')).toBeInTheDocument()
        expect(screen.getByText('Cached transaction')).toBeInTheDocument()
        expect(screen.queryByText('No transactions found')).not.toBeInTheDocument()
    })
})
