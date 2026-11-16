import { describe, it, expect, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/test/utils/render'
import BudgetForm from '@/features/budgets/components/BudgetForm'
import { createCategory, createSectionWithCategories } from '@/test/fixtures/domain'
import type { BudgetFormInput } from '@/features/budgets/schemas/budget.schema'

const sections = [createSectionWithCategories()]

describe('BudgetForm', () => {
    it('associates validation errors and submits a valid zero budget', async () => {
        const user = userEvent.setup()
        const onSubmit = vi.fn()
        render(<BudgetForm sections={sections} submitLabel="Create budget" onSubmit={onSubmit} />)

        await user.click(screen.getByRole('button', { name: /create budget/i }))
        expect(await screen.findByText(/Category is required/i)).toBeInTheDocument()
        expect(screen.getByRole('combobox', { name: /category/i })).toHaveAccessibleDescription(
            'Category is required',
        )
        expect(screen.getByLabelText(/Month/i)).toHaveAccessibleDescription(
            'Month must use YYYY-MM format',
        )

        await user.click(screen.getByRole('combobox', { name: /category/i }))
        await user.click(await screen.findByRole('option', { name: 'Groceries' }))
        await user.type(screen.getByLabelText(/Month/i), new Date().toISOString().slice(0, 7))
        const amount = screen.getByLabelText(/Amount/i)
        await user.clear(amount)
        await user.type(amount, '0')
        await user.click(screen.getByRole('button', { name: /create budget/i }))

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith({
                categoryId: 'cat-1',
                month: new Date().toISOString().slice(0, 7),
                amount: 0,
            })
        })
    })

    it('preserves a selected archived category when editing', () => {
        const archivedCategory = createCategory({ isArchived: true })
        const archivedSection = createSectionWithCategories([archivedCategory], {
            isArchived: true,
        })
        const initialValues: BudgetFormInput = {
            categoryId: archivedCategory.id,
            month: '2026-06',
            amount: '25',
        }

        render(
            <BudgetForm
                sections={[archivedSection]}
                initialValues={initialValues}
                submitLabel="Save changes"
                onSubmit={vi.fn()}
            />,
        )

        expect(screen.getByRole('combobox', { name: /category/i })).toHaveTextContent(
            'Groceries (archived)',
        )
    })

    it('disables archived category options for new budgets', async () => {
        const user = userEvent.setup()
        const activeCategory = createCategory({ id: 'cat-active', name: 'Active category' })
        const archivedCategory = createCategory({ isArchived: true })
        const section = createSectionWithCategories([activeCategory, archivedCategory])

        render(<BudgetForm sections={[section]} submitLabel="Create budget" onSubmit={vi.fn()} />)

        await user.click(screen.getByRole('combobox', { name: /category/i }))
        const option = await screen.findByRole('option', { name: /groceries \(archived\)/i })
        expect(option).toHaveAttribute('aria-disabled', 'true')
    })

    it('explains when no active categories are available', () => {
        const archivedCategory = createCategory({ isArchived: true })
        const archivedSection = createSectionWithCategories([archivedCategory], {
            isArchived: true,
        })

        render(
            <BudgetForm
                sections={[archivedSection]}
                submitLabel="Create budget"
                onSubmit={vi.fn()}
            />,
        )

        expect(screen.getByRole('combobox', { name: /category/i })).toBeDisabled()
        expect(
            screen.getByText(/No categories are available\. Create a category/i),
        ).toBeInTheDocument()
    })

    it('keeps form controls disabled and prevents repeat submissions while pending', async () => {
        const user = userEvent.setup()
        let finishSubmit: (() => void) | undefined
        const onSubmit = vi.fn(
            () =>
                new Promise<void>((resolve) => {
                    finishSubmit = resolve
                }),
        )
        const initialValues: BudgetFormInput = {
            categoryId: 'cat-1',
            month: '2026-06',
            amount: '25.50',
        }

        render(
            <BudgetForm
                sections={sections}
                initialValues={initialValues}
                submitLabel="Save changes"
                onSubmit={onSubmit}
            />,
        )

        const submitButton = screen.getByRole('button', { name: 'Save changes' })
        await user.click(submitButton)
        await waitFor(() => expect(submitButton).toBeDisabled())

        expect(screen.getByLabelText(/Amount/)).toBeDisabled()
        expect(onSubmit).toHaveBeenCalledTimes(1)

        finishSubmit?.()
        await waitFor(() => expect(submitButton).toBeEnabled())
    })
})
