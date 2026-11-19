import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import TransactionList from './TransactionList'
import type { Transaction } from '@/features/transactions/types/transaction.types'

const baseTransaction: Transaction = {
    id: 'transaction-expense',
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
    account: { id: 'account-chequing', name: 'Chequing', color: 'destructive', icon: 'wallet' },
    category: {
        id: 'category-groceries',
        name: 'Groceries',
        icon: 'shopping-cart',
        sectionId: 'needs',
    },
}

const transactions: Transaction[] = [
    baseTransaction,
    {
        ...baseTransaction,
        id: 'transaction-income',
        type: 'INCOME',
        amount: 3250,
        merchant: 'Payroll',
        categoryId: 'category-salary',
        category: {
            id: 'category-salary',
            name: 'Salary',
            icon: 'briefcase-business',
            sectionId: 'income',
        },
    },
    {
        ...baseTransaction,
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
            color: 'destructive',
            icon: 'wallet',
        },
        toAccount: {
            id: 'account-savings',
            name: 'Savings',
            color: 'success',
            icon: 'piggy-bank',
        },
    },
    {
        ...baseTransaction,
        id: 'transaction-adjustment',
        type: 'ADJUSTMENT',
        amount: -25,
        merchant: null,
        note: 'Reconciliation',
        categoryId: null,
        category: null,
    },
]

const meta = {
    title: 'Design System/Product/Transactions/Transaction List',
    component: TransactionList,
    tags: ['autodocs'],
    args: {
        transactions,
        onEdit: fn(),
        onArchive: fn(),
    },
} satisfies Meta<typeof TransactionList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const FilteredResults: Story = {
    args: { transactions: transactions.filter((transaction) => transaction.type === 'EXPENSE') },
}
