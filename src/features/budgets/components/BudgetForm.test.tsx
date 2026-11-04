import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/test/utils/render'
import BudgetForm from '@/features/budgets/components/BudgetForm'
import { createCategory, createSectionWithCategories } from '@/test/fixtures/domain'

const sections = [createSectionWithCategories()]

describe('BudgetForm', () => {
    it('validates required fields and negative amount', async () => {
        const user = userEvent.setup()
        const onSubmit = vi.fn()
        render(<BudgetForm sections={sections} submitLabel="Create budget" onSubmit={onSubmit} />)

        await user.click(screen.getByRole('button', { name: /create budget/i }))
        expect(await screen.findByText(/Category is required/i)).toBeInTheDocument()

        // select category and set month and zero amount -> should submit
        await user.selectOptions(screen.getByRole('combobox', { name: /category/i }), 'cat-1')
        await user.type(screen.getByLabelText(/Month/i), new Date().toISOString().slice(0, 7))
        await user.type(screen.getByLabelText(/Amount/i), '0')
        await user.click(screen.getByRole('button', { name: /create budget/i }))
        expect(onSubmit).toHaveBeenCalled()
    })

    it('preserves an archived category when editing an existing budget', () => {
        const archivedCategory = createCategory({ isArchived: true })
        const archivedSection = createSectionWithCategories([archivedCategory], {
            isArchived: true,
        })

        render(
            <BudgetForm
                sections={[archivedSection]}
                initialValues={{ categoryId: archivedCategory.id, month: '2026-06', amount: 25 }}
                submitLabel="Save changes"
                onSubmit={vi.fn()}
            />,
        )

        const option = screen.getByRole('option', { name: /groceries \(archived\)/i })
        expect(option).not.toBeDisabled()
    })
})
