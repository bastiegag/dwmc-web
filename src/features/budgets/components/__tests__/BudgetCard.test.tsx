import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/test/utils/render'
import BudgetCard from '@/features/budgets/components/BudgetCard'
import type { Budget } from '@/features/budgets/types/budget.types'

const budget = {
    id: 'budget-1',
    month: '2026-06',
    amount: 500,
    spent: 600,
    remaining: -100,
    progress: 120,
    isOverBudget: true,
    transactionCount: 4,
    isArchived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: {
        id: 'cat-1',
        name: 'Groceries',
        icon: 'cart',
        sectionId: 'sec-1',
        section: { id: 'sec-1', name: 'Food', color: '#3b82f6' },
    },
}

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
