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
