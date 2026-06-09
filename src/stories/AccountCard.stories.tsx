import type { Meta, StoryObj } from '@storybook/react-vite'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { AccountCard } from '@/features/accounts/components/AccountCard'
import type { Account } from '@/features/accounts/types/account.types'

const meta: Meta<typeof AccountCard> = {
    title: 'Accounts/AccountCard',
    component: AccountCard,
    decorators: [
        (Story) => (
            <QueryClientProvider
                client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
            >
                <MemoryRouter>
                    <div className="p-6 max-w-sm">
                        <Story />
                    </div>
                </MemoryRouter>
            </QueryClientProvider>
        ),
    ],
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
