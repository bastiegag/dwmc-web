import type { Meta, StoryObj } from '@storybook/react-vite'
import { SummaryCard } from '@/features/dashboard/components/SummaryCard'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const meta: Meta<typeof SummaryCard> = {
    title: 'Dashboard/SummaryCard',
    component: SummaryCard,
    decorators: [
        (Story) => (
            <QueryClientProvider client={new QueryClient()}>
                <div className="p-6 max-w-sm">
                    <Story />
                </div>
            </QueryClientProvider>
        ),
    ],
}

export default meta
type Story = StoryObj<typeof meta>

export const Income: Story = { args: { label: 'Income', value: 5000 } }
export const Expense: Story = { args: { label: 'Expenses', value: 3200 } }
export const NetNegative: Story = { args: { label: 'Net', value: -120 } }
