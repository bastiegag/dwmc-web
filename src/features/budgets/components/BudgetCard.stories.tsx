import type { Meta, StoryObj } from '@storybook/react-vite'
import { BudgetCard } from './BudgetCard'
import type { Budget } from '@/features/budgets/types/budget.types'

const budget: Budget = {
    id: 'budget-groceries',
    month: '2026-10',
    amount: 600,
    spent: 420,
    remaining: 180,
    progress: 70,
    isOverBudget: false,
    transactionCount: 12,
    isArchived: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    category: {
        id: 'category-groceries',
        name: 'Groceries',
        icon: 'shopping-cart',
        sectionId: 'section-needs',
        section: { id: 'section-needs', name: 'Needs', color: '#7cb2ac' },
    },
}

const meta = {
    title: 'Design System/Product/Budgets/Budget Card',
    component: BudgetCard,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'Shows planned, spent, remaining, and progress values for one budget. Over-budget progress uses the destructive semantic color.',
            },
        },
    },
    args: { onEdit: () => undefined, onArchive: () => undefined },
} satisfies Meta<typeof BudgetCard>

export default meta
type Story = StoryObj<typeof meta>

export const OnTrack: Story = { args: { budget } }
export const OverBudget: Story = {
    args: {
        budget: {
            ...budget,
            id: 'budget-restaurants',
            category: { ...budget.category, name: 'Restaurants' },
            amount: 250,
            spent: 275,
            remaining: -25,
            progress: 110,
            isOverBudget: true,
            transactionCount: 8,
        },
    },
}
