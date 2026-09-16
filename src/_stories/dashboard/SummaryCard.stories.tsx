import type { Meta, StoryObj } from '@storybook/react-vite'
import { SummaryCard } from '@/features/dashboard/components/SummaryCard'
import { withCompactLayout, withQueryClient } from '../decorators'

const meta: Meta<typeof SummaryCard> = {
    title: 'Dashboard/SummaryCard',
    component: SummaryCard,
    decorators: [withQueryClient, withCompactLayout],
}

export default meta
type Story = StoryObj<typeof meta>

export const Income: Story = { args: { label: 'Income', value: 5000 } }
export const Expense: Story = { args: { label: 'Expenses', value: 3200 } }
export const NetNegative: Story = { args: { label: 'Net', value: -120 } }
