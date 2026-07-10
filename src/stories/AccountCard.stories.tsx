import type { Meta, StoryObj } from '@storybook/react-vite'
import { AccountCard } from '@/features/accounts/components/AccountCard'
import type { Account } from '@/features/accounts/types/account.types'
import { withCompactLayout, withQueryClient, withRouter } from './decorators'

const meta: Meta<typeof AccountCard> = {
    title: 'Accounts/AccountCard',
    component: AccountCard,
    decorators: [withQueryClient, withRouter, withCompactLayout],
}

export default meta
type Story = StoryObj<typeof meta>

const checkingAccount: Account = {
    id: 'a1',
    name: 'Checking',
    type: 'CHECKING',
    startingBalance: 1250.75,
    currentBalance: 1250.75,
    goal: null,
    color: '#3b82f6',
    icon: 'wallet',
    isArchived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
}

const creditCard: Account = {
    id: 'a2',
    name: 'Visa',
    type: 'CREDIT_CARD',
    startingBalance: -850,
    currentBalance: -850,
    goal: 0,
    color: '#ef4444',
    icon: 'credit-card',
    isArchived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
}

const savings: Account = {
    id: 'a3',
    name: 'Emergency Fund',
    type: 'SAVINGS',
    startingBalance: 3000,
    currentBalance: 3000,
    goal: 10000,
    color: '#22c55e',
    icon: 'shield',
    isArchived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
}

export const Checking: Story = {
    args: { account: checkingAccount, onEdit: () => {}, onArchive: async () => {} },
}

export const CreditCard: Story = {
    args: { account: creditCard, onEdit: () => {}, onArchive: async () => {} },
}

export const SavingsWithGoal: Story = {
    args: { account: savings, onEdit: () => {}, onArchive: async () => {} },
}
