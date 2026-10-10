import type { Meta, StoryObj } from '@storybook/react-vite'
import { EmptyAccountsState } from '@/features/accounts/components/EmptyAccountsState'
import { EmptyBudgetsState } from '@/features/budgets/components/EmptyBudgetsState'
import { EmptyCategoriesState } from '@/features/categories/components/EmptyCategoriesState'
import { EmptyTransactionsState } from '@/features/transactions/components/EmptyTransactionsState'

const meta = {
    title: 'Design System/Patterns/Empty States/Product Empty States',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component:
                    'Product-specific empty states reuse the shared Empty State primitive while giving users a clear next step for each collection.',
            },
        },
    },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Accounts: Story = { render: () => <EmptyAccountsState /> }
export const Budgets: Story = { render: () => <EmptyBudgetsState month="2026-10" /> }
export const Categories: Story = { render: () => <EmptyCategoriesState /> }
export const Transactions: Story = { render: () => <EmptyTransactionsState /> }
