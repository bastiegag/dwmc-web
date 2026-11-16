import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
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
                    'Shows backend-provided planned, spent, remaining, and usage values. The progress bar is visually clamped, while its text and accessible value retain the actual percentage.',
            },
        },
    },
    args: { onEdit: fn(), onArchive: fn() },
} satisfies Meta<typeof BudgetCard>

export default meta
type Story = StoryObj<typeof meta>

export const OnTrack: Story = { args: { budget } }

export const NoSpending: Story = {
    args: {
        budget: {
            ...budget,
            amount: 250,
            spent: 0,
            remaining: 250,
            progress: 0,
            isOverBudget: false,
            transactionCount: 0,
        },
    },
}

export const FullyUsed: Story = {
    args: {
        budget: {
            ...budget,
            amount: 250,
            spent: 250,
            remaining: 0,
            progress: 100,
            isOverBudget: false,
        },
    },
}

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

export const ZeroLimit: Story = {
    args: {
        budget: {
            ...budget,
            amount: 0,
            spent: 25,
            remaining: -25,
            progress: 100,
            isOverBudget: true,
        },
    },
}

export const LargeAmounts: Story = {
    args: {
        budget: {
            ...budget,
            amount: 9_876_543_210.99,
            spent: 1_234_567_890.12,
            remaining: 8_641_975_320.87,
            progress: 12.5,
            isOverBudget: false,
        },
    },
}

export const LongCategoryName: Story = {
    args: {
        budget: {
            ...budget,
            category: {
                ...budget.category,
                name: 'A very long category name for responsive layout review',
            },
        },
    },
}
