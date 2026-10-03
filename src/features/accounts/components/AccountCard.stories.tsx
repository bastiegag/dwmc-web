import type { Meta, StoryObj } from '@storybook/react-vite'
import { AccountCard } from './AccountCard'
import type { Account } from '@/features/accounts/types/account.types'

const account: Account = {
    id: 'account-chequing',
    name: 'Chequing',
    type: 'CHECKING',
    startingBalance: 1200,
    currentBalance: 2450.5,
    goal: null,
    color: '#ed6a5a',
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
    color: '#7cb2ac',
    icon: 'landmark',
}

const meta = {
    title: 'Design System/Product/Accounts/Account Card',
    component: AccountCard,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'Displays an account balance and actions. Archive is destructive and opens an explicit confirmation dialog before calling the supplied callback.',
            },
        },
    },
    args: { onEdit: () => undefined, onArchive: () => undefined },
} satisfies Meta<typeof AccountCard>

export default meta
type Story = StoryObj<typeof meta>

export const Chequing: Story = { args: { account } }
export const SavingsGoal: Story = { args: { account: savings } }
