import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
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

const withTransaction = (overrides: Partial<Transaction>): Transaction => ({
    ...transaction,
    ...overrides,
})

const meta = {
    title: 'Design System/Product/Transactions/Transaction Item',
    component: TransactionItem,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component:
                    'A transaction summary with its type, date, amount, description, account, category, and archive/edit actions.',
            },
        },
    },
    args: { onEdit: fn(), onArchive: fn() },
} satisfies Meta<typeof TransactionItem>

export default meta
type Story = StoryObj<typeof meta>

export const Expense: Story = { args: { transaction } }
export const Income: Story = {
    args: {
        transaction: withTransaction({
            id: 'transaction-income',
            type: 'INCOME',
            amount: 3250,
            merchant: 'Payroll',
            category: {
                id: 'category-salary',
                name: 'Salary',
                icon: 'briefcase',
                sectionId: 'income',
            },
            categoryId: 'category-salary',
        }),
    },
}
export const Transfer: Story = {
    args: {
        transaction: withTransaction({
            id: 'transaction-transfer',
            type: 'TRANSFER',
            amount: 500,
            merchant: null,
            categoryId: null,
            category: null,
            accountId: null,
            account: null,
            fromAccountId: 'account-chequing',
            toAccountId: 'account-savings',
            fromAccount: {
                id: 'account-chequing',
                name: 'Chequing',
                color: '#ed6a5a',
                icon: 'wallet',
            },
            toAccount: {
                id: 'account-savings',
                name: 'Long-term savings',
                color: '#4f9d69',
                icon: 'piggy-bank',
            },
        }),
    },
}
export const Adjustment: Story = {
    args: {
        transaction: withTransaction({
            id: 'transaction-adjustment',
            type: 'ADJUSTMENT',
            amount: -125.75,
            merchant: null,
            note: 'Reconciliation',
            categoryId: null,
            category: null,
        }),
    },
}
export const LongDescription: Story = {
    args: {
        transaction: withTransaction({
            merchant:
                'A very long merchant name with enough words to wrap naturally across a narrow transaction card',
        }),
    },
}
export const LargeAmount: Story = {
    args: { transaction: withTransaction({ amount: 1234567890.12 }) },
}
export const LongAccountName: Story = {
    args: {
        transaction: withTransaction({
            account: {
                id: 'account-chequing',
                name: 'Household chequing account for everyday and recurring expenses',
                color: '#ed6a5a',
                icon: 'wallet',
            },
        }),
    },
}
export const LongCategoryName: Story = {
    args: {
        transaction: withTransaction({
            category: {
                id: 'category-groceries',
                name: 'Household groceries, pantry staples, and weekly meal planning',
                icon: 'shopping-cart',
                sectionId: 'needs',
            },
        }),
    },
}
export const MissingOptionalInformation: Story = {
    args: {
        transaction: withTransaction({
            merchant: null,
            note: null,
            accountId: null,
            account: null,
            categoryId: null,
            category: null,
        }),
    },
}
export const AccountActions: Story = { args: { transaction } }
