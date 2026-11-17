import { useState } from 'react'
import type { ComponentProps } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Button } from '@/components/ui'
import type { TransactionFormValues } from '@/features/transactions/schemas/transaction.schema'
import { TransactionOptionsState } from './TransactionOptionsState'
import TransactionDialog from './TransactionDialog'
import type { Account } from '@/features/accounts'
import type { SectionWithCategories } from '@/features/categories/types'

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

const sections: SectionWithCategories[] = []

const initialValues: TransactionFormValues = {
    type: 'EXPENSE',
    amount: 84.32,
    date: '2026-10-15',
    accountId: 'account-chequing',
    fromAccountId: null,
    toAccountId: null,
    categoryId: null,
    merchant: 'Neighbourhood Market',
    note: null,
}

const createValues: TransactionFormValues = {
    type: 'EXPENSE',
    amount: 0,
    date: '2026-10-15',
    accountId: null,
    fromAccountId: null,
    toAccountId: null,
    categoryId: null,
    merchant: null,
    note: null,
}

const ControlledDialog = (args: ComponentProps<typeof TransactionDialog>) => {
    const [open, setOpen] = useState(true)

    return (
        <>
            <Button type="button" onClick={() => setOpen(true)}>
                Open transaction dialog
            </Button>
            <TransactionDialog {...args} open={open} onOpenChange={setOpen} />
        </>
    )
}

const meta = {
    title: 'Design System/Product/Transactions/Transaction Dialog',
    component: TransactionDialog,
    tags: ['autodocs'],
    args: {
        open: true,
        mode: 'create',
        accounts,
        sections,
        onOpenChange: fn(),
        onSubmit: fn(),
    },
    render: (args) => <ControlledDialog {...args} />,
} satisfies Meta<typeof TransactionDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Create: Story = { args: { initialValues: createValues } }
export const Edit: Story = {
    args: { mode: 'edit', initialValues },
}
export const Pending: Story = {
    args: { isPending: true, initialValues },
}
export const ServerError: Story = {
    args: {
        initialValues,
        errorMessage: 'Unable to save transaction. Please try again.',
    },
}
export const OptionsLoading: Story = {
    args: {
        optionsState: (
            <TransactionOptionsState
                accounts={{
                    hasData: false,
                    isLoading: true,
                    isFetching: true,
                    error: null,
                    onRetry: fn(),
                }}
                categories={{
                    hasData: false,
                    isLoading: true,
                    isFetching: true,
                    error: null,
                    onRetry: fn(),
                }}
                showLoading
            />
        ),
    },
}
export const OptionsError: Story = {
    args: {
        optionsState: (
            <TransactionOptionsState
                accounts={{
                    hasData: false,
                    isLoading: false,
                    isFetching: false,
                    error: new Error('Accounts unavailable.'),
                    onRetry: fn(),
                }}
                categories={{
                    hasData: true,
                    isLoading: false,
                    isFetching: false,
                    error: null,
                    onRetry: fn(),
                }}
            />
        ),
    },
}
