import { describe, it, beforeEach, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { useQueryClient } from '@tanstack/react-query'
import { http, HttpResponse } from 'msw'
import { PrimaryActionButton } from '@/shared/primary-action'
import { MonthNavigator } from '@/shared/month'
import { screen, waitFor, waitForElementToBeRemoved, within } from '@testing-library/react'
import { render } from '@/test/utils/render'
import { BudgetsPage } from '@/features/budgets/pages/BudgetsPage'
import { server } from '@/test/mocks/server'
import { createBudget } from '@/test/fixtures/domain'
import { formatCurrency } from '@/lib/format-currency'
import { budgetQueryKeys } from '@/features/budgets/hooks/use-budgets'

const RefreshBudgets = () => {
    const queryClient = useQueryClient()

    return (
        <button
            type="button"
            onClick={() =>
                void queryClient.invalidateQueries({ queryKey: budgetQueryKeys.lists() })
            }
        >
            Refresh budgets
        </button>
    )
}

describe('BudgetsPage', () => {
    beforeEach(() => {
        vi.stubEnv('VITE_API_URL', 'http://localhost:8787')
    })

    it('renders heading and loading state', () => {
        render(<BudgetsPage />)
        expect(screen.getByRole('heading', { name: /budgets/i, level: 1 })).toBeInTheDocument()
        expect(screen.getByRole('status')).toHaveTextContent(/loading budgets/i)
    })

    it('shows budgets when data is present', async () => {
        render(<BudgetsPage />, { initialEntries: ['/budgets?month=2026-08'] })

        await waitForElementToBeRemoved(() => screen.queryByText(/loading budgets/i))

        expect(screen.getByText(/groceries/i)).toBeInTheDocument()
        expect(screen.getByText(/total planned/i)).toBeInTheDocument()
    })

    it('shows the initial error and retries the budget request', async () => {
        const user = userEvent.setup()
        let requestCount = 0
        server.use(
            http.get('http://localhost:8787/budgets*', () => {
                requestCount += 1
                if (requestCount === 1) {
                    return HttpResponse.json(
                        { error: { message: 'Budgets unavailable' } },
                        { status: 500 },
                    )
                }
                return HttpResponse.json({ data: [] })
            }),
        )

        render(<BudgetsPage />)

        expect(await screen.findByText('Budgets unavailable')).toBeInTheDocument()
        expect(screen.getByRole('alert')).toHaveTextContent('Could not load budgets')
        expect(screen.queryByText('Total planned')).not.toBeInTheDocument()
        await user.click(screen.getByRole('button', { name: 'Retry' }))

        expect(await screen.findByText('No budgets yet')).toBeInTheDocument()
        expect(requestCount).toBe(2)
    })

    it('preserves cached budgets during background errors and disables retry while refetching', async () => {
        const user = userEvent.setup()
        let finishRetry: (() => void) | undefined
        const retryGate = new Promise<void>((resolve) => {
            finishRetry = resolve
        })
        let requestCount = 0
        const cachedBudget = createBudget({
            amount: 100,
            spent: 25,
            remaining: 75,
            progress: 25,
            isOverBudget: false,
        })
        server.use(
            http.get('http://localhost:8787/budgets*', async () => {
                requestCount += 1
                if (requestCount === 2) {
                    return HttpResponse.json(
                        { error: { message: 'Budgets refresh failed' } },
                        { status: 500 },
                    )
                }
                if (requestCount === 3) await retryGate
                return HttpResponse.json({ data: [cachedBudget] })
            }),
        )

        render(
            <>
                <BudgetsPage />
                <RefreshBudgets />
            </>,
            { initialEntries: ['/budgets?month=2026-06'] },
        )

        expect(await screen.findByRole('heading', { name: 'Groceries' })).toBeInTheDocument()
        await user.click(screen.getByRole('button', { name: 'Refresh budgets' }))

        expect(await screen.findByText('Budgets refresh failed')).toBeInTheDocument()
        expect(screen.getByRole('status')).toHaveTextContent('Budget list refresh failed')
        expect(screen.queryByRole('alert')).not.toBeInTheDocument()
        expect(screen.getByRole('heading', { name: 'Groceries' })).toBeInTheDocument()
        expect(screen.getByText('Total planned').parentElement).toHaveTextContent(
            formatCurrency(100).replace(/\u00a0/g, ' '),
        )

        const retryButton = screen.getByRole('button', { name: 'Retry' })
        await user.click(retryButton)
        await waitFor(() => expect(requestCount).toBe(3))
        await waitFor(() => expect(retryButton).toBeDisabled())
        expect(screen.getByRole('heading', { name: 'Groceries' })).toBeInTheDocument()

        finishRetry?.()
        await waitFor(() => {
            expect(screen.queryByText('Budget list refresh failed')).not.toBeInTheDocument()
        })
        expect(screen.getByRole('heading', { name: 'Groceries' })).toBeInTheDocument()
    })

    it('requests the selected month and hides the previous month while the next month loads', async () => {
        const user = userEvent.setup()
        const requests: string[] = []
        let finishJuly: (() => void) | undefined
        const julyGate = new Promise<void>((resolve) => {
            finishJuly = resolve
        })
        server.use(
            http.get('http://localhost:8787/budgets*', async ({ request }) => {
                const month = new URL(request.url).searchParams.get('month') ?? ''
                requests.push(month)
                if (month === '2026-07') await julyGate

                const budget = createBudget({
                    month,
                    amount: month === '2026-06' ? 100 : 200,
                    spent: 0,
                    remaining: month === '2026-06' ? 100 : 200,
                    progress: 0,
                    isOverBudget: false,
                })
                return HttpResponse.json({ data: [budget] })
            }),
        )

        render(
            <>
                <MonthNavigator />
                <BudgetsPage />
            </>,
            { initialEntries: ['/budgets?month=2026-06'] },
        )

        await waitForElementToBeRemoved(() => screen.queryByText(/Loading budgets/i))
        expect(requests).toContain('2026-06')
        expect(screen.getByText('Total planned').parentElement).toHaveTextContent(
            formatCurrency(100).replace(/\u00a0/g, ' '),
        )

        await user.click(screen.getByRole('button', { name: 'Go to next month' }))
        await waitFor(() => expect(requests).toContain('2026-07'))
        expect(screen.getByText(/Loading budgets/i)).toBeInTheDocument()
        expect(screen.queryByText('Total planned')).not.toBeInTheDocument()

        finishJuly?.()
        await waitFor(() => {
            expect(screen.getByText('Total planned').parentElement).toHaveTextContent(
                formatCurrency(200).replace(/\u00a0/g, ' '),
            )
        })
    })

    it('keeps entered values after a failed create and closes after a successful retry', async () => {
        const user = userEvent.setup()
        const payloads: Array<Record<string, unknown>> = []
        let requestCount = 0
        server.use(
            http.post('http://localhost:8787/budgets', async ({ request }) => {
                requestCount += 1
                payloads.push((await request.json()) as Record<string, unknown>)
                if (requestCount === 1) {
                    return HttpResponse.json(
                        {
                            error: {
                                message: 'A budget already exists for this category and month.',
                            },
                        },
                        { status: 409 },
                    )
                }
                return HttpResponse.json(
                    {
                        data: createBudget({
                            month: '2026-06',
                            amount: 125.25,
                            spent: 0,
                            remaining: 125.25,
                            progress: 0,
                            isOverBudget: false,
                        }),
                    },
                    { status: 201 },
                )
            }),
        )

        render(
            <>
                <BudgetsPage />
                <PrimaryActionButton />
            </>,
            { initialEntries: ['/budgets?month=2026-06'] },
        )

        await user.click(screen.getByTestId('primary-action-button'))
        const category = screen.getByRole('combobox', { name: 'Category' })
        await waitFor(() => expect(category).toBeEnabled())
        await user.click(category)
        await user.click(await screen.findByRole('option', { name: 'Groceries' }))

        const amount = screen.getByLabelText<HTMLInputElement>(/Amount/)
        await user.clear(amount)
        await user.type(amount, '125.25')
        await user.click(screen.getByRole('button', { name: 'Create budget' }))

        expect(await screen.findByRole('alert')).toHaveTextContent(
            'A budget already exists for this category and month.',
        )
        expect(screen.getByRole('dialog', { name: 'New Budget' })).toBeInTheDocument()
        expect(screen.getByRole('combobox', { name: 'Category' })).toHaveTextContent('Groceries')
        expect(amount.value).toContain('125,25')

        await user.click(screen.getByRole('button', { name: 'Create budget' }))
        await waitFor(() => {
            expect(screen.queryByRole('dialog', { name: 'New Budget' })).not.toBeInTheDocument()
        })
        expect(payloads).toEqual([
            { categoryId: 'cat-1', month: '2026-06', amount: 125.25 },
            { categoryId: 'cat-1', month: '2026-06', amount: 125.25 },
        ])
    })

    it('keeps archive failures inside the confirmation dialog', async () => {
        const user = userEvent.setup()
        server.use(
            http.get('http://localhost:8787/budgets*', () =>
                HttpResponse.json({ data: [createBudget()] }),
            ),
            http.delete('http://localhost:8787/budgets/budget-1', () =>
                HttpResponse.json({ error: { message: 'Archive denied' } }, { status: 500 }),
            ),
        )

        render(<BudgetsPage />)

        await user.click(await screen.findByRole('button', { name: 'Archive Groceries' }))
        const dialog = screen.getByRole('alertdialog')
        await user.click(screen.getByRole('button', { name: /^Archive$/ }))

        expect(await within(dialog).findByRole('alert')).toHaveTextContent('Archive denied')
        expect(screen.getByRole('alertdialog')).toBeInTheDocument()
        expect(screen.queryByText('Archive failed')).not.toBeInTheDocument()
    })

    it('sums page totals at cent precision', async () => {
        server.use(
            http.get('http://localhost:8787/budgets', () =>
                HttpResponse.json({
                    data: [
                        createBudget({
                            amount: 0.1,
                            spent: 0.1,
                            remaining: 0.1,
                        }),
                        createBudget({
                            id: 'budget-2',
                            amount: 0.2,
                            spent: 0.2,
                            remaining: 0.2,
                        }),
                    ],
                }),
            ),
        )

        render(<BudgetsPage />)

        await waitForElementToBeRemoved(() => screen.queryByText(/loading budgets/i))

        const expectedTotal = formatCurrency(0.3).replace(/\u00a0/g, ' ')
        expect(screen.getByText(/total planned/i).parentElement).toHaveTextContent(expectedTotal)
        expect(screen.getByText(/total spent/i).parentElement).toHaveTextContent(expectedTotal)
        expect(screen.getByText(/total remaining/i).parentElement).toHaveTextContent(expectedTotal)
    })

    it('opens a new budget for the selected month', async () => {
        const user = userEvent.setup()
        render(
            <>
                <BudgetsPage />
                <PrimaryActionButton />
            </>,
            { initialEntries: ['/budgets?month=2026-05'] },
        )

        await user.click(await screen.findByTestId('primary-action-button'))

        expect(screen.getByLabelText(/Month/)).toHaveValue('2026-05')
    })
})
