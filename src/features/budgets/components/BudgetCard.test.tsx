import { describe, it, expect, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
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

        const archiveButton = screen.getByRole('button', { name: /Archive Groceries/i })
        await user.click(archiveButton)
        const dialog = screen.getByRole('alertdialog')
        expect(dialog).toHaveAccessibleName('Archive budget?')
        expect(dialog).toHaveAccessibleDescription(/This will archive the budget/i)
        await user.keyboard('{Escape}')
        expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
        expect(archiveButton).toHaveFocus()

        await user.click(archiveButton)
        await user.click(screen.getByRole('button', { name: /^Archive$/i }))
        expect(onArchive).toHaveBeenCalled()
    })

    it('keeps the confirmation open and reports archive failures', async () => {
        const user = userEvent.setup()
        const onArchive = vi.fn().mockRejectedValue(new Error('Archive failed'))

        render(
            <BudgetCard
                budget={budget as unknown as Budget}
                onEdit={vi.fn()}
                onArchive={onArchive}
            />,
        )

        await user.click(screen.getByRole('button', { name: /Archive Groceries/i }))
        await user.click(screen.getByRole('button', { name: /^Archive$/i }))

        await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Archive failed'))
        expect(screen.getByRole('alertdialog')).toBeInTheDocument()
        expect(onArchive).toHaveBeenCalledTimes(1)
    })
})
