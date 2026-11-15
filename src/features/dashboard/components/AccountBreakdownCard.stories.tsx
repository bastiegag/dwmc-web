import type { Meta, StoryObj } from '@storybook/react-vite'
import { AccountBreakdownCard } from './AccountBreakdownCard'
import type { SummaryAccountBreakdown } from '@/features/dashboard/types/summary.types'

const meta = {
    title: 'Design System/Product/Dashboard/Account Breakdown Card',
    component: AccountBreakdownCard,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'Shows monthly net transaction activity by account, not current account balances.',
            },
        },
    },
} satisfies Meta<typeof AccountBreakdownCard>

export default meta
type Story = StoryObj<typeof meta>

const accounts: SummaryAccountBreakdown[] = [
    {
        accountId: 'account-chequing',
        name: 'Chequing',
        type: 'CHECKING',
        color: '#ed6a5a',
        icon: 'wallet',
        incomeTotal: 3200,
        expenseTotal: 1280,
        adjustmentTotal: 0,
        transferInTotal: 0,
        transferOutTotal: 0,
        netTotal: 1920,
        transactionCount: 18,
    },
    {
        accountId: 'account-savings',
        name: 'Emergency savings account for unexpected household expenses',
        type: 'SAVINGS',
        color: '#7cb2ac',
        icon: 'landmark',
        incomeTotal: 0,
        expenseTotal: 450,
        adjustmentTotal: 0,
        transferInTotal: 0,
        transferOutTotal: 0,
        netTotal: -450,
        transactionCount: 2,
    },
]

export const Default: Story = { args: { items: accounts } }
export const Empty: Story = { args: { items: [] } }
export const ZeroActivity: Story = {
    args: {
        items: [
            {
                ...accounts[0],
                incomeTotal: 0,
                expenseTotal: 0,
                netTotal: 0,
                transactionCount: 0,
            },
        ],
    },
}
export const LargeActivity: Story = {
    args: {
        items: [
            {
                ...accounts[0],
                name: 'A very long account name for responsive layout review',
                incomeTotal: 123456789.99,
                expenseTotal: 98765432.1,
                netTotal: 24691357.89,
                transactionCount: 123456,
            },
        ],
    },
}
