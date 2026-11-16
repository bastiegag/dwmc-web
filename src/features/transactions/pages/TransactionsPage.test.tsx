import { beforeEach, describe, expect, it, vi } from 'vitest'
import { waitFor } from '@testing-library/react'
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

    it('shows an initial loading status before transactions are available', () => {
        render(<TransactionsPage />)

        expect(screen.getByRole('status')).toHaveTextContent('Loading transactions')
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
        expect(screen.getByRole('alert')).toHaveTextContent('Could not load transactions')
        expect(screen.queryByText('No transactions found')).not.toBeInTheDocument()
        await user.click(screen.getByRole('button', { name: 'Retry' }))

        expect(await screen.findByText('No transactions found')).toBeInTheDocument()
        expect(requestCount).toBe(2)
    })

    it('keeps cached results and pagination during a failed background refresh and retry', async () => {
        const user = userEvent.setup()
        const transaction = createTransaction({
            id: 'cached-transaction',
            merchant: 'Cached transaction',
        })
        let finishRetry: (() => void) | undefined
        const retryGate = new Promise<void>((resolve) => {
            finishRetry = resolve
        })
        let requestCount = 0
        server.use(
            http.get('http://localhost:8787/transactions*', async () => {
                requestCount += 1
                if (requestCount === 2) {
                    return HttpResponse.json(
                        { error: { message: 'Transactions refresh failed' } },
                        { status: 500 },
                    )
                }
                if (requestCount === 3) {
                    await retryGate
                }
                return HttpResponse.json({
                    data: [transaction],
                    meta: { page: 1, total: 30, totalPages: 2 },
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
        expect(screen.getByText('Transaction list refresh failed')).toBeInTheDocument()
        expect(screen.getByRole('status')).toHaveTextContent('Transaction list refresh failed')
        expect(screen.queryByRole('alert')).not.toBeInTheDocument()
        expect(screen.getByText('Cached transaction')).toBeInTheDocument()
        expect(
            screen.getByRole('navigation', { name: 'Transaction pagination' }),
        ).toHaveTextContent('Page 1 of 2 (30 transactions)')

        const retryButton = screen.getByRole('button', { name: 'Retry' })
        await user.click(retryButton)
        await waitFor(() => expect(requestCount).toBe(3))
        await waitFor(() => expect(retryButton).toBeDisabled())
        expect(screen.getByText('Cached transaction')).toBeInTheDocument()
        expect(
            screen.getByRole('navigation', { name: 'Transaction pagination' }),
        ).toBeInTheDocument()

        finishRetry?.()
        await waitFor(() => {
            expect(screen.queryByText('Transaction list refresh failed')).not.toBeInTheDocument()
        })
        expect(screen.getByText('Cached transaction')).toBeInTheDocument()
    })

    it('resets pagination to the first page when an applied filter changes', async () => {
        const user = userEvent.setup()
        const requests: Array<{ page: string; type: string | null }> = []
        server.use(
            http.get('http://localhost:8787/transactions*', ({ request }) => {
                const url = new URL(request.url)
                const page = url.searchParams.get('page') ?? '1'
                const type = url.searchParams.get('type')
                requests.push({ page, type })

                return HttpResponse.json({
                    data: [
                        createTransaction({
                            id: `page-${page}-${type ?? 'all'}`,
                            merchant: `Page ${page}`,
                            type: type === 'INCOME' ? 'INCOME' : 'EXPENSE',
                        }),
                    ],
                    meta: { page: Number(page), total: 50, totalPages: 2 },
                })
            }),
        )

        render(<TransactionsPage />, { initialEntries: ['/transactions?month=2026-06'] })

        expect(await screen.findByText('Page 1')).toBeInTheDocument()
        await user.click(screen.getByRole('button', { name: 'Next transaction page' }))
        expect(await screen.findByText('Page 2')).toBeInTheDocument()

        await user.click(screen.getByRole('combobox', { name: 'Type' }))
        await user.click(screen.getByRole('option', { name: 'Income' }))

        await waitFor(() => {
            expect(requests).toContainEqual({ page: '1', type: 'INCOME' })
        })
        expect(await screen.findByText('Page 1')).toBeInTheDocument()
        expect(
            screen.getByRole('navigation', { name: 'Transaction pagination' }),
        ).toHaveTextContent('Page 1 of 2')
    })
})
