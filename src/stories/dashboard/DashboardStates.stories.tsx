import type { Meta, StoryObj } from '@storybook/react-vite'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner'
import EmptyDashboardState from '@/features/dashboard/components/EmptyDashboardState'
import CategoryBreakdownCard from '@/features/dashboard/components/CategoryBreakdownCard'
import RecentTransactionsCard from '@/features/dashboard/components/RecentTransactionsCard'
import SummaryCards from '@/features/dashboard/components/SummaryCards'
import { withCompactLayout } from '../decorators'

const meta = {
    title: 'Dashboard/States',
    decorators: [withCompactLayout],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Loading: Story = {
    render: () => (
        <div className="flex justify-center py-12" role="status" aria-live="polite">
            <LoadingSpinner aria-label="Loading summary" size="lg" />
        </div>
    ),
}

export const Empty: Story = {
    render: () => <EmptyDashboardState />,
}

export const Error: Story = {
    render: () => (
        <Alert variant="destructive">
            <AlertTitle>Could not load summary</AlertTitle>
            <AlertDescription>
                Summary unavailable
                <div className="mt-2">
                    <button className="text-sm text-primary" type="button">
                        Retry
                    </button>
                </div>
            </AlertDescription>
        </Alert>
    ),
}

export const LargeValues: Story = {
    render: () => (
        <SummaryCards
            totals={{
                incomeTotal: 999999999.99,
                expenseTotal: 123456789.01,
                adjustmentTotal: -9876543.21,
                transferTotal: 250000000,
                netTotal: 867901234.77,
                transactionCount: 123456,
            }}
        />
    ),
}

export const LongLabels: Story = {
    render: () => (
        <div className="space-y-4">
            <CategoryBreakdownCard
                title="Top expense categories with an unusually long dashboard heading"
                items={[
                    {
                        categoryId: 'long-label',
                        name: 'Household maintenance and recurring home improvement supplies',
                        icon: null,
                        section: {
                            id: 'needs',
                            name: 'Essential household needs',
                            color: '#3b82f6',
                        },
                        total: 1845.75,
                        transactionCount: 17,
                        percentage: 42,
                    },
                ]}
            />
            <RecentTransactionsCard
                transactions={[
                    {
                        id: 'long-transaction',
                        type: 'EXPENSE',
                        amount: 249.99,
                        date: '2026-06-30T12:00:00.000Z',
                        merchant:
                            'Neighborhood market and household goods delivery service with a long name',
                        note: null,
                        accountId: null,
                        categoryId: null,
                    },
                ]}
            />
        </div>
    ),
}
