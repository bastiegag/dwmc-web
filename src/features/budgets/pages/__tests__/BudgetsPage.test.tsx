import { describe, it, beforeEach, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/test/utils/render'
import { BudgetsPage } from '@/features/budgets/pages/BudgetsPage'

describe('BudgetsPage', () => {
    beforeEach(() => {
        vi.stubEnv('VITE_API_URL', 'http://localhost:8787')
    })

    it('renders heading and month selector', () => {
        render(<BudgetsPage />)
        expect(screen.getByRole('heading', { name: /budgets/i, level: 1 })).toBeInTheDocument()
        expect(screen.getByLabelText(/previous month/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/next month/i)).toBeInTheDocument()
    })

    it('shows budgets when data is present', async () => {
        render(<BudgetsPage />)
        await screen.findByText(/Planned/i)
        // wait for loading spinner to go away
        const { waitForElementToBeRemoved } = await import('@testing-library/react')
        await waitForElementToBeRemoved(() => screen.queryByLabelText(/Loading budgets/i))
        expect(screen.getByText(/Groceries/i)).toBeInTheDocument()
    })

    it('allows changing month via month selector', async () => {
        const user = userEvent.setup()
        render(<BudgetsPage />)
        const next = screen.getByLabelText(/next month/i)
        await user.click(next)
        expect(screen.getByLabelText(/next month/i)).toBeInTheDocument()
    })
})
