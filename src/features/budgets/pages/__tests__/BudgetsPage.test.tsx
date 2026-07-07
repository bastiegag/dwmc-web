import { describe, it, beforeEach, expect, vi } from 'vitest'
import { screen, waitForElementToBeRemoved } from '@testing-library/react'
import { render } from '@/test/utils/render'
import { BudgetsPage } from '@/features/budgets/pages/BudgetsPage'

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
})
