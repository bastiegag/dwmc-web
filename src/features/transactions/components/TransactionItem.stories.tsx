import type { Meta, StoryObj } from '@storybook/react-vite'
import { TransactionItem } from './TransactionItem'
import type { Transaction } from '@/features/transactions/types/transaction.types'

const transaction: Transaction = {
    id: 'transaction-groceries',
    type: 'EXPENSE',
    amount: 84.32,
    date: '2026-10-02',
    merchant: 'Neighbourhood Market',
    note: null,
    accountId: 'account-chequing',
    fromAccountId: null,
    toAccountId: null,
    categoryId: 'category-groceries',
    isArchived: false,
    createdAt: '2026-10-02T12:00:00.000Z',
    updatedAt: '2026-10-02T12:00:00.000Z',
    account: { id: 'account-chequing', name: 'Chequing', color: '#ed6a5a', icon: 'wallet' },
    category: {
        id: 'category-groceries',
        name: 'Groceries',
        icon: 'shopping-cart',
        sectionId: 'needs',
    },
}

const meta = {
    title: 'Design System/Product/Transactions/Transaction Item',
    component: TransactionItem,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component:
                    'A transaction summary with merchant, date, account, and archive/edit actions. Use the confirmation dialog before destructive archive operations.',
            },
        },
    },
    args: { onEdit: () => undefined, onArchive: () => undefined },
} satisfies Meta<typeof TransactionItem>

export default meta
type Story = StoryObj<typeof meta>

export const Expense: Story = { args: { transaction } }
export const WithoutDescription: Story = {
    args: { transaction: { ...transaction, merchant: null, note: null } },
}
