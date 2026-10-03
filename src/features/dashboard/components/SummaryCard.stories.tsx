import type { Meta, StoryObj } from '@storybook/react-vite'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { SummaryCard } from './SummaryCard'

const meta = {
    title: 'Design System/Product/Dashboard/Summary Card',
    component: SummaryCard,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'A compact dashboard metric card. Use a concise label, a formatted currency value, and optional supporting context.',
            },
        },
    },
} satisfies Meta<typeof SummaryCard>

export default meta
type Story = StoryObj<typeof meta>

export const Income: Story = {
    args: {
        label: 'Income',
        value: 3200,
        subtitle: 'This month',
        icon: <ArrowUpRight className="size-4 text-success" aria-hidden="true" />,
    },
}

export const Spending: Story = {
    args: {
        label: 'Spending',
        value: 1280,
        subtitle: 'Across 12 transactions',
        icon: <ArrowDownRight className="size-4 text-destructive" aria-hidden="true" />,
    },
}
