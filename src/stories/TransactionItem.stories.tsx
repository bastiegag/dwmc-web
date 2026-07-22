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
