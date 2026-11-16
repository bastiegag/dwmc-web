import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import TransactionForm from './TransactionForm'
import type { Account } from '@/features/accounts'
import type { SectionWithCategories } from '@/features/categories/types'
import type { TransactionFormValues } from '@/features/transactions/schemas/transaction.schema'

const accounts: Account[] = [
    {
        id: 'account-chequing',
        name: 'Chequing',
        type: 'CHECKING',
        startingBalance: 1200,
        currentBalance: 1200,
        goal: null,
        color: '#ed6a5a',
        icon: 'wallet',
        isArchived: false,
        createdAt: '2026-10-01T00:00:00.000Z',
        updatedAt: '2026-10-01T00:00:00.000Z',
    },
    {
        id: 'account-savings',
        name: 'Savings',
        type: 'SAVINGS',
        startingBalance: 4000,
        currentBalance: 4000,
        goal: 6000,
        color: '#4f9d69',
        icon: 'piggy-bank',
        isArchived: false,
        createdAt: '2026-10-01T00:00:00.000Z',
        updatedAt: '2026-10-01T00:00:00.000Z',
    },
]

const sections: SectionWithCategories[] = [
    {
        id: 'section-needs',
        name: 'Needs',
        color: '#ed6a5a',
        isArchived: false,
        createdAt: '2026-10-01T00:00:00.000Z',
        updatedAt: '2026-10-01T00:00:00.000Z',
        categories: [
            {
                id: 'category-groceries',
                name: 'Groceries',
                icon: 'shopping-cart',
                sectionId: 'section-needs',
                isArchived: false,
                createdAt: '2026-10-01T00:00:00.000Z',
                updatedAt: '2026-10-01T00:00:00.000Z',
            },
        ],
    },
]

const values = (overrides: Partial<TransactionFormValues> = {}): TransactionFormValues => ({
    type: 'EXPENSE',
    amount: 0,
    date: '2026-10-15',
    accountId: null,
    fromAccountId: null,
    toAccountId: null,
    categoryId: null,
    merchant: null,
    note: null,
    ...overrides,
})

const meta = {
    title: 'Design System/Product/Transactions/Transaction Form',
    component: TransactionForm,
    tags: ['autodocs'],
    args: {
        accounts,
        sections,
        onSubmit: fn(),
    },
} satisfies Meta<typeof TransactionForm>

export default meta
type Story = StoryObj<typeof meta>

export const CreateExpense: Story = { args: { initialValues: values() } }
export const CreateIncome: Story = {
    args: { initialValues: values({ type: 'INCOME' }) },
}
export const CreateTransfer: Story = {
    args: {
        initialValues: values({
            type: 'TRANSFER',
            accountId: null,
            fromAccountId: 'account-chequing',
            toAccountId: 'account-savings',
        }),
    },
}
export const CreateAdjustment: Story = {
    args: { initialValues: values({ type: 'ADJUSTMENT', amount: -120 }) },
}
export const Edit: Story = {
    args: {
        initialValues: values({
            amount: 84.32,
            accountId: 'account-chequing',
            categoryId: 'category-groceries',
            merchant: 'Neighbourhood Market',
        }),
    },
}
export const ValidationErrors: Story = {
    args: {
        initialValues: values({
            type: 'TRANSFER',
            amount: 0,
            fromAccountId: 'account-chequing',
            toAccountId: 'account-chequing',
        }),
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement.ownerDocument.body)
        await userEvent.click(canvas.getByRole('button', { name: 'Save' }))
        await expect(canvas.getByText('Amount must be greater than 0')).toBeInTheDocument()
        await expect(canvas.getByText('From and To accounts must be different')).toBeInTheDocument()
    },
}
export const Pending: Story = {
    args: { initialValues: values(), isPending: true },
}
export const ServerError: Story = {
    args: {
        initialValues: values(),
        errorMessage: 'Unable to save transaction. Please try again.',
    },
}
export const LongValues: Story = {
    args: {
        initialValues: values({
            amount: 123456789.99,
            accountId: 'account-chequing',
            merchant: 'A very long merchant name for a transaction',
            note: 'A detailed note with a long value that should remain usable on a smaller screen.',
        }),
    },
}
