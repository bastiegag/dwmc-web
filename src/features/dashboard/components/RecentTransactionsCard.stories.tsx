import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import { RecentTransactionsCard } from './RecentTransactionsCard'

const meta = {
    title: 'Design System/Product/Dashboard/Recent Transactions Card',
    component: RecentTransactionsCard,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <MemoryRouter initialEntries={['/dashboard?month=2026-06']}>
                <Story />
            </MemoryRouter>
        ),
    ],
    parameters: {
        docs: {
            description: {
                component:
                    'Shows recent transactions from the monthly summary and links to the selected month.',
            },
        },
    },
} satisfies Meta<typeof RecentTransactionsCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        transactions: [
            {
                id: 'transaction-groceries',
                type: 'EXPENSE',
                amount: 45.5,
                date: '2026-06-30T12:00:00.000Z',
                merchant: 'Grocery Store',
                note: null,
                accountId: 'account-chequing',
                categoryId: 'category-groceries',
            },
            {
                id: 'transaction-income',
                type: 'INCOME',
                amount: 3200,
                date: '2026-06-15T12:00:00.000Z',
                merchant: null,
                note: 'Monthly salary',
                accountId: 'account-chequing',
                categoryId: 'category-salary',
            },
        ],
    },
}

export const Empty: Story = { args: { transactions: [] } }
