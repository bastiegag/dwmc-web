import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { QueryState } from '@/components/feedback'
import { Alert } from '@/components/ui'
import { BudgetList } from './BudgetList'
import type { Budget } from '@/features/budgets/types/budget.types'

const makeBudget = (id: string, name: string, overrides: Partial<Budget> = {}): Budget => ({
    id,
    month: '2026-06',
    amount: 500,
    spent: 325,
    remaining: 175,
    progress: 65,
    isOverBudget: false,
    transactionCount: 8,
    isArchived: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    category: {
        id: `category-${id}`,
        name,
        icon: 'shopping-bag',
        sectionId: 'section-needs',
        section: { id: 'section-needs', name: 'Needs', color: 'secondary' },
    },
    ...overrides,
})

const meta = {
    title: 'Design System/Product/Budgets/Budget List',
    component: BudgetList,
    tags: ['autodocs'],
    args: { onEdit: fn(), onArchive: fn() },
} satisfies Meta<typeof BudgetList>

export default meta
type Story = StoryObj<typeof meta>

export const MultipleBudgets: Story = {
    args: {
        budgets: [
            makeBudget('groceries', 'Groceries'),
            makeBudget('transportation', 'Transportation', {
                amount: 250,
                spent: 275,
                remaining: -25,
                progress: 110,
                isOverBudget: true,
                transactionCount: 12,
            }),
        ],
    },
}

export const MixedBudgetStatuses: Story = {
    args: {
        budgets: [
            makeBudget('utilities', 'Utilities', {
                spent: 0,
                remaining: 300,
                progress: 0,
                transactionCount: 0,
            }),
            makeBudget('dining', 'Dining out', {
                amount: 150,
                spent: 150,
                remaining: 0,
                progress: 100,
                transactionCount: 5,
            }),
            makeBudget('travel', 'Travel', {
                amount: 0,
                spent: 75,
                remaining: -75,
                progress: 100,
                isOverBudget: true,
                transactionCount: 2,
            }),
        ],
    },
}

export const Loading: Story = {
    args: { budgets: [], onEdit: fn(), onArchive: fn() },
    render: () => (
        <QueryState
            isLoading
            isError={false}
            loadingLabel="Loading budgets"
            errorTitle="Could not load budgets"
            fallbackErrorMessage="Please refresh and try again."
        />
    ),
}

export const Error: Story = {
    args: { budgets: [], onEdit: fn(), onArchive: fn() },
    render: () => (
        <QueryState
            isLoading={false}
            isError
            loadingLabel="Loading budgets"
            errorTitle="Could not load budgets"
            errorMessage="The budget list could not be loaded."
            fallbackErrorMessage="Please refresh and try again."
            onRetry={fn()}
        />
    ),
}

export const BackgroundRefreshError: Story = {
    args: { budgets: [], onEdit: fn(), onArchive: fn() },
    render: () => (
        <div className="space-y-4">
            <Alert
                variant="warning"
                role="status"
                title="Budget list refresh failed"
                description="Previously loaded budgets are still shown."
                action={{ label: 'Retry', onClick: fn() }}
            />
            <BudgetList
                budgets={[makeBudget('groceries', 'Groceries')]}
                onEdit={fn()}
                onArchive={fn()}
            />
        </div>
    ),
}
