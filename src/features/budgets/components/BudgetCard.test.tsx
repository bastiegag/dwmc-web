import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/test/utils/render'
import BudgetCard from '@/features/budgets/components/BudgetCard'
import type { Budget } from '@/features/budgets/types/budget.types'
import { createBudget } from '@/test/fixtures/domain'

const budget = createBudget()

describe('BudgetCard', () => {
    it('renders values and handles archive', async () => {
        const user = userEvent.setup()
        const onEdit = vi.fn()
        const onArchive = vi.fn().mockResolvedValue(undefined)
        render(
            <BudgetCard
                budget={budget as unknown as Budget}
                onEdit={onEdit}
                onArchive={onArchive}
            />,
        )

        expect(screen.getByText(/Groceries/i)).toBeInTheDocument()
        expect(screen.getByText(/Planned/i)).toBeInTheDocument()
        expect(screen.getByText(/Over budget/i)).toBeInTheDocument()

        await user.click(screen.getByRole('button', { name: /Archive Groceries/i }))
        expect(screen.getByRole('alertdialog')).toBeInTheDocument()
        await user.click(screen.getByRole('button', { name: /^Archive$/i }))
        expect(onArchive).toHaveBeenCalled()
    })
})
