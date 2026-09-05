import { beforeEach, describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@/test/utils/render'
import { TransactionsPage } from '@/features/transactions/pages/TransactionsPage'
import { PrimaryActionButton } from '@/shared/primary-action'

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

        await user.click(await screen.findByRole('button', { name: /add transaction/i }))

        expect(screen.getByLabelText('Date')).toHaveValue('2026-05-01')
    })

    it('defaults a new transaction to today for the current month', async () => {
        const user = userEvent.setup()
        const currentMonth = new Date().toISOString().slice(0, 7)
        const today = new Date().toISOString().slice(0, 10)

        render(
            <>
                <TransactionsPage />
                <PrimaryActionButton />
            </>,
            { initialEntries: [`/transactions?month=${currentMonth}`] },
        )

        await user.click(await screen.findByRole('button', { name: /add transaction/i }))

        expect(screen.getByLabelText('Date')).toHaveValue(today)
    })
})
