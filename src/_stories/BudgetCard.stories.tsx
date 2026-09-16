import type { Meta, StoryObj } from '@storybook/react-vite'
import { BudgetCard } from '@/features/budgets/components/BudgetCard'
import { createBudget } from '@/test/fixtures/domain'
import { withCenteredLayout } from './decorators'

const meta: Meta<typeof BudgetCard> = {
    title: 'Budgets/BudgetCard',
    component: BudgetCard,
    decorators: [withCenteredLayout],
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const UnderBudget: Story = {
    args: {
        budget: createBudget({
            amount: 800,
            spent: 420,
            remaining: 380,
            progress: 52,
            isOverBudget: false,
        }),
        onEdit: () => undefined,
        onArchive: async () => undefined,
    },
}

export const OverBudget: Story = {
    args: {
        budget: createBudget({
            amount: 500,
            spent: 620,
            remaining: -120,
            progress: 124,
            isOverBudget: true,
        }),
        onEdit: () => undefined,
        onArchive: async () => undefined,
    },
}

export const ZeroUse: Story = {
    args: {
        budget: createBudget({
            amount: 250,
            spent: 0,
            remaining: 250,
            progress: 0,
            isOverBudget: false,
            transactionCount: 0,
        }),
        onEdit: () => undefined,
        onArchive: async () => undefined,
    },
}

export const ExactUse: Story = {
    args: {
        budget: createBudget({
            amount: 250,
            spent: 250,
            remaining: 0,
            progress: 100,
            isOverBudget: false,
            transactionCount: 5,
        }),
        onEdit: () => undefined,
        onArchive: async () => undefined,
    },
}

export const LargeValue: Story = {
    args: {
        budget: createBudget({
            amount: 1250000,
            spent: 875000.5,
            remaining: 374999.5,
            progress: 70,
            isOverBudget: false,
            transactionCount: 128,
        }),
        onEdit: () => undefined,
        onArchive: async () => undefined,
    },
}

export const LongCategoryName: Story = {
    args: {
        budget: createBudget({
            amount: 800,
            spent: 420,
            remaining: 380,
            progress: 52.5,
            isOverBudget: false,
            category: {
                ...createBudget().category,
                name: 'Household groceries and weekly essentials',
            },
        }),
        onEdit: () => undefined,
        onArchive: async () => undefined,
    },
}

export const ArchivedHistory: Story = {
    args: {
        budget: createBudget({
            amount: 500,
            spent: 500,
            remaining: 0,
            progress: 100,
            isOverBudget: false,
            transactionCount: 0,
            isArchived: true,
        }),
        onEdit: () => undefined,
        onArchive: async () => undefined,
    },
}
