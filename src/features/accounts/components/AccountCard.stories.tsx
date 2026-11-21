import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { AccountCard } from './AccountCard'
import type { Account } from '@/features/accounts/types/account.types'

const account: Account = {
    id: 'account-chequing',
    name: 'Chequing',
    type: 'CHECKING',
    startingBalance: 1200,
    currentBalance: 2450.5,
    goal: null,
    color: 'destructive',
    icon: 'wallet',
    isArchived: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
}

const savings: Account = {
    ...account,
    id: 'account-savings',
    name: 'Emergency savings',
    type: 'SAVINGS',
    currentBalance: 4200,
    goal: 6000,
    color: 'secondary',
    icon: 'landmark',
}

const accountTypes: { type: Account['type']; name: string }[] = [
    { type: 'CHECKING', name: 'Checking' },
    { type: 'SAVINGS', name: 'Savings' },
    { type: 'CREDIT_CARD', name: 'Credit card' },
    { type: 'CASH', name: 'Cash' },
    { type: 'INVESTMENT', name: 'Investment' },
    { type: 'LOAN', name: 'Loan' },
    { type: 'OTHER', name: 'Other' },
]

const meta = {
    title: 'Design System/Product/Accounts/Account Card',
    component: AccountCard,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'Displays the current and starting account balances, and a savings-goal progress indicator when applicable. Archive is destructive and opens an explicit confirmation dialog before calling the supplied callback. Archived accounts are not shown by the default Accounts query.',
            },
        },
    },
    args: { onEdit: fn(), onArchive: fn() },
} satisfies Meta<typeof AccountCard>

export default meta
type Story = StoryObj<typeof meta>

export const Chequing: Story = { args: { account } }
export const SavingsGoal: Story = { args: { account: savings } }

export const Default: Story = { args: { account } }

export const ZeroBalance: Story = {
    args: { account: { ...account, id: 'account-zero', name: 'Zero balance', currentBalance: 0 } },
}

export const NegativeBalance: Story = {
    args: {
        account: {
            ...account,
            id: 'account-negative',
            name: 'Credit card',
            type: 'CREDIT_CARD',
            currentBalance: -1250.75,
        },
    },
}

export const LargeBalance: Story = {
    args: {
        account: { ...account, id: 'account-large', currentBalance: 123456789.99 },
    },
}

export const LongAccountName: Story = {
    args: {
        account: {
            ...account,
            id: 'account-long-name',
            name: 'Primary household chequing account for everyday expenses',
        },
    },
}

export const DifferentAccountTypes: Story = {
    args: { account },
    render: (args) => (
        <div className="grid gap-4 sm:grid-cols-2">
            {accountTypes.map(({ type, name }) => (
                <AccountCard
                    key={type}
                    {...args}
                    account={{
                        ...account,
                        id: `account-${type.toLowerCase()}`,
                        name,
                        type,
                    }}
                />
            ))}
        </div>
    ),
}
