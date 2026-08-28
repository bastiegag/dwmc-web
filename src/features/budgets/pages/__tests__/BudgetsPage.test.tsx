import { describe, it, beforeEach, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { PrimaryActionButton } from '@/shared/primary-action'
import { screen, waitForElementToBeRemoved } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { render } from '@/test/utils/render'
import { BudgetsPage } from '@/features/budgets/pages/BudgetsPage'
import { server } from '@/test/mocks/server'
import { createBudget } from '@/test/fixtures/domain'
import { formatCurrency } from '@/lib/format-currency'

describe('BudgetsPage', () => {
    beforeEach(() => {
        vi.stubEnv('VITE_API_URL', 'http://localhost:8787')
    })

    it('renders heading and loading state', () => {
        render(<BudgetsPage />)
        expect(screen.getByRole('heading', { name: /budgets/i, level: 1 })).toBeInTheDocument()
        expect(screen.getByLabelText(/loading budgets/i)).toBeInTheDocument()
    })

    it('shows budgets when data is present', async () => {
        render(<BudgetsPage />)

        await waitForElementToBeRemoved(() => screen.queryByLabelText(/loading budgets/i))

        expect(screen.getByText(/groceries/i)).toBeInTheDocument()
        expect(screen.getByText(/total planned/i)).toBeInTheDocument()
    })

    it('shows an error state when loading budgets fails', async () => {
        server.use(
            http.get('http://localhost:8787/budgets*', () =>
                HttpResponse.json({ error: { message: 'Budgets unavailable' } }, { status: 500 }),
            ),
        )

        render(<BudgetsPage />)

        expect(await screen.findByText('Budgets unavailable')).toBeInTheDocument()
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

        await waitForElementToBeRemoved(() => screen.queryByLabelText(/loading budgets/i))

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

        await user.click(await screen.findByRole('button', { name: /add budget/i }))

        expect(screen.getByLabelText('Month')).toHaveValue('2026-05')
    })
})
