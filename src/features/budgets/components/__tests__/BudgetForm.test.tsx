import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/test/utils/render'
import BudgetForm from '@/features/budgets/components/BudgetForm'

const sections = [
    {
        id: 'sec-1',
        name: 'Food',
        color: '#3b82f6',
        isArchived: false,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        categories: [
            {
                id: 'cat-1',
                name: 'Groceries',
                icon: 'shopping-cart',
                sectionId: 'sec-1',
                isArchived: false,
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-01T00:00:00.000Z',
            },
        ],
    },
]

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
})
