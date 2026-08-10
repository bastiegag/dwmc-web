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

export const LongName: Story = {
    args: {
        account: createAccount({
            id: 'a4',
            name: 'Household expenses and recurring bills account',
            currentBalance: 2450.5,
        }),
        onEdit: () => {},
        onArchive: async () => {},
    },
}

export const ZeroBalance: Story = {
    args: {
        account: createAccount({
            id: 'a5',
            name: 'Empty Cash',
            startingBalance: 0,
            currentBalance: 0,
            color: '#64748b',
            icon: 'coins',
        }),
        onEdit: () => {},
        onArchive: async () => {},
    },
}

export const Archived: Story = {
    args: {
        account: createAccount({
            id: 'a6',
            name: 'Archived Savings',
            type: 'SAVINGS',
            currentBalance: 125,
            goal: 500,
            isArchived: true,
            color: '#94a3b8',
            icon: 'archive',
        }),
        onEdit: () => {},
        onArchive: async () => {},
    },
}

export const LargeValue: Story = {
    args: {
        account: createAccount({
            id: 'a7',
            name: 'Long Term Investments',
            type: 'INVESTMENT',
            startingBalance: 9999999999.99,
            currentBalance: 10000000000.01,
            color: '#0f766e',
            icon: 'landmark',
        }),
        onEdit: () => {},
        onArchive: async () => {},
    },
}
