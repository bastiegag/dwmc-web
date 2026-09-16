import type { Meta, StoryObj } from '@storybook/react-vite'
import { TransactionItem } from '@/features/transactions/components/TransactionItem'
import { createTransaction } from '@/test/fixtures/domain'
import { withCenteredLayout } from './decorators'

const meta: Meta<typeof TransactionItem> = {
    title: 'Transactions/TransactionItem',
    component: TransactionItem,
    decorators: [withCenteredLayout],
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Expense: Story = {
    args: {
        transaction: createTransaction(),
        onEdit: () => undefined,
        onArchive: () => undefined,
    },
}

export const Transfer: Story = {
    args: {
        transaction: createTransaction({
            type: 'TRANSFER',
            fromAccountId: 'a1',
            toAccountId: 'a2',
            accountId: null,
            categoryId: null,
            merchant: null,
            note: 'Move to savings',
            fromAccount: { id: 'a1', name: 'Checking', color: '#3b82f6', icon: 'wallet' },
            toAccount: { id: 'a2', name: 'Savings', color: '#22c55e', icon: 'banknote' },
        }),
        onEdit: () => undefined,
        onArchive: () => undefined,
    },
}

export const Income: Story = {
    args: {
        transaction: createTransaction({
            type: 'INCOME',
            amount: 2500,
            merchant: 'Acme Payroll',
            note: null,
        }),
        onEdit: () => undefined,
        onArchive: () => undefined,
    },
}

export const Adjustment: Story = {
    args: {
        transaction: createTransaction({
            type: 'ADJUSTMENT',
            amount: -125.5,
            categoryId: null,
            merchant: null,
            note: 'Corrected opening balance',
        }),
        onEdit: () => undefined,
        onArchive: () => undefined,
    },
}

export const LongText: Story = {
    args: {
        transaction: createTransaction({
            merchant:
                'Neighborhood market and household supplies with a deliberately long merchant name',
            note: 'A longer note helps verify the transaction remains readable without shifting the action controls.',
        }),
        onEdit: () => undefined,
        onArchive: () => undefined,
    },
}

export const LargeAmount: Story = {
    args: {
        transaction: createTransaction({ amount: 9999999999.99, merchant: 'Large settlement' }),
        onEdit: () => undefined,
        onArchive: () => undefined,
    },
}

export const Archived: Story = {
    args: {
        transaction: createTransaction({
            isArchived: true,
            merchant: null,
            note: 'Archived historical transaction',
        }),
        onEdit: () => undefined,
        onArchive: () => undefined,
    },
}
