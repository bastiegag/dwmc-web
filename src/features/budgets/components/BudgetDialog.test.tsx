import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@/test/utils/render'
import { BudgetDialog } from '@/features/budgets/components/BudgetDialog'
import type { BudgetFormInput } from '@/features/budgets/schemas/budget.schema'
import { createSectionWithCategories } from '@/test/fixtures/domain'

const sections = [createSectionWithCategories()]

describe('BudgetDialog', () => {
    it('uses the selected month as the create form default', () => {
        render(
            <BudgetDialog
                open
                mode="create"
                sections={sections}
                defaultMonth="2026-06"
                onOpenChange={vi.fn()}
                onSubmit={vi.fn()}
            />,
        )

        expect(screen.getByRole('dialog', { name: 'New Budget' })).toBeInTheDocument()
        expect(screen.getByLabelText(/Month/)).toHaveValue('2026-06')
    })

    it('populates edit values and presents server errors accessibly', () => {
        const initialValues: BudgetFormInput = {
            categoryId: 'cat-1',
            month: '2026-05',
            amount: '125.50',
        }

        render(
            <BudgetDialog
                open
                mode="edit"
                sections={sections}
                initialValues={initialValues}
                errorMessage="A budget already exists for this category and month."
                onOpenChange={vi.fn()}
                onSubmit={vi.fn()}
            />,
        )

        expect(screen.getByRole('dialog', { name: 'Edit budget' })).toBeInTheDocument()
        expect(screen.getByLabelText(/Month/)).toHaveValue('2026-05')
        expect(screen.getByLabelText<HTMLInputElement>(/Amount/).value).toContain('125')
        expect(screen.getByRole('alert')).toHaveTextContent(
            'A budget already exists for this category and month.',
        )
    })

    it('prevents dismissal while a save is pending', async () => {
        const user = userEvent.setup()
        const onOpenChange = vi.fn()

        render(
            <BudgetDialog
                open
                mode="create"
                sections={sections}
                defaultMonth="2026-06"
                isPending
                onOpenChange={onOpenChange}
                onSubmit={vi.fn()}
            />,
        )

        expect(screen.getByLabelText(/Amount/)).toBeDisabled()
        expect(screen.getByRole('button', { name: 'Close budget dialog' })).toBeDisabled()
        await user.keyboard('{Escape}')
        await user.click(document.body)

        expect(screen.getByRole('dialog', { name: 'New Budget' })).toBeInTheDocument()
        expect(onOpenChange).not.toHaveBeenCalled()
    })
})
