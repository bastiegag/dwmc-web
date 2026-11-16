import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { BudgetForm } from './BudgetForm'
import type { BudgetFormInput } from '@/features/budgets/schemas/budget.schema'
import type { SectionWithCategories } from '@/features/categories/types'

const sections: SectionWithCategories[] = [
    {
        id: 'section-needs',
        name: 'Needs',
        color: '#7cb2ac',
        isArchived: false,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        categories: [
            {
                id: 'category-groceries',
                name: 'Groceries',
                icon: 'shopping-cart',
                sectionId: 'section-needs',
                isArchived: false,
                createdAt: '2026-01-01T00:00:00.000Z',
                updatedAt: '2026-01-01T00:00:00.000Z',
            },
        ],
    },
]

const editValues: BudgetFormInput = {
    categoryId: 'category-groceries',
    month: '2026-06',
    amount: '600',
}

const archivedCategory = {
    id: 'category-archived',
    name: 'Archived groceries',
    icon: 'shopping-cart',
    sectionId: 'section-archived',
    isArchived: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
}

const meta = {
    title: 'Design System/Product/Budgets/Budget Form',
    component: BudgetForm,
    tags: ['autodocs'],
    args: { sections, submitLabel: 'Create budget', onSubmit: fn() },
    parameters: {
        docs: {
            description: {
                component:
                    'Creates and edits monthly category budgets using decimal-safe currency input and the existing API amount contract.',
            },
        },
    },
} satisfies Meta<typeof BudgetForm>

export default meta
type Story = StoryObj<typeof meta>

export const Create: Story = { args: {} }

export const Edit: Story = {
    args: { initialValues: editValues, submitLabel: 'Save changes' },
}

export const ValidationErrors: Story = {
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole('button', { name: 'Create budget' }))
    },
}

export const Pending: Story = { args: { isPending: true } }

export const ServerError: Story = {
    args: { errorMessage: 'A budget already exists for this category and month.' },
}

export const ArchivedCategory: Story = {
    args: {
        sections: [
            {
                id: 'section-archived',
                name: 'Archived',
                color: '#7cb2ac',
                isArchived: true,
                createdAt: '2026-01-01T00:00:00.000Z',
                updatedAt: '2026-01-01T00:00:00.000Z',
                categories: [archivedCategory],
            },
        ],
        initialValues: {
            categoryId: archivedCategory.id,
            month: '2026-06',
            amount: '25.50',
        },
        submitLabel: 'Save changes',
    },
}
