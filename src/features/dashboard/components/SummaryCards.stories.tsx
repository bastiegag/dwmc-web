import type { Meta, StoryObj } from '@storybook/react-vite'
import { SummaryCards } from './SummaryCards'

const meta = {
    title: 'Design System/Product/Dashboard/Summary Cards',
    component: SummaryCards,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'Displays the monthly income, expense, net, and transaction totals returned by the summary API.',
            },
        },
    },
} satisfies Meta<typeof SummaryCards>

export default meta
type Story = StoryObj<typeof meta>

const baseTotals = {
    incomeTotal: 3200,
    expenseTotal: 1280,
    adjustmentTotal: 0,
    transferTotal: 0,
    netTotal: 1920,
    transactionCount: 18,
}

export const Default: Story = { args: { totals: baseTotals } }

export const ZeroValues: Story = {
    args: {
        totals: {
            incomeTotal: 0,
            expenseTotal: 0,
            adjustmentTotal: 0,
            transferTotal: 0,
            netTotal: 0,
            transactionCount: 0,
        },
    },
}

export const NegativeNet: Story = {
    args: {
        totals: {
            ...baseTotals,
            incomeTotal: 800,
            expenseTotal: 1250,
            netTotal: -450,
        },
    },
}

export const LargeValues: Story = {
    args: {
        totals: {
            ...baseTotals,
            incomeTotal: 123456789.99,
            expenseTotal: 98765432.1,
            netTotal: 24691357.89,
            transactionCount: 123456,
        },
    },
}
