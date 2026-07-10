import type { Meta, StoryObj } from '@storybook/react-vite'
import { AccountCard } from '@/features/accounts/components/AccountCard'
import { createAccount } from '@/test/fixtures/domain'
import { withCompactLayout, withQueryClient, withRouter } from './decorators'

const meta: Meta<typeof AccountCard> = {
    title: 'Accounts/AccountCard',
    component: AccountCard,
    decorators: [withQueryClient, withRouter, withCompactLayout],
}

export default meta
type Story = StoryObj<typeof meta>

export const Checking: Story = {
    args: { account: createAccount(), onEdit: () => {}, onArchive: async () => {} },
}

export const CreditCard: Story = {
    args: {
        account: createAccount({
            id: 'a2',
            name: 'Visa',
            type: 'CREDIT_CARD',
            startingBalance: -850,
            currentBalance: -850,
            goal: 0,
            color: '#ef4444',
            icon: 'credit-card',
        }),
        onEdit: () => {},
        onArchive: async () => {},
    },
}

export const SavingsWithGoal: Story = {
    args: {
        account: createAccount({
            id: 'a3',
            name: 'Emergency Fund',
            type: 'SAVINGS',
            startingBalance: 3000,
            currentBalance: 3000,
            goal: 10000,
            color: '#22c55e',
            icon: 'shield',
        }),
        onEdit: () => {},
        onArchive: async () => {},
    },
}
