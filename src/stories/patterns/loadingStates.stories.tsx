import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card, Skeleton } from '@/components/ui'
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner'

const meta = {
    title: 'Design System/Patterns/Loading States',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component:
                    'Loading patterns that keep the final layout visible while data loads. Skeletons mirror the shape of the content; spinners are used for inline or blocking actions where no content shape exists.',
            },
        },
    },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const AccountBalanceSkeleton = () => (
    <Card className="max-w-sm" title="Chequing account">
        <div className="space-y-3">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-24" />
        </div>
    </Card>
)

const TransactionListSkeleton = () => (
    <Card className="max-w-md" title="Recent transactions">
        <ul className="divide-y">
            {Array.from({ length: 3 }, (_, index) => (
                <li key={index} className="flex items-center justify-between py-3">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                </li>
            ))}
        </ul>
    </Card>
)

export const AccountBalance: Story = { render: () => <AccountBalanceSkeleton /> }

export const TransactionList: Story = { render: () => <TransactionListSkeleton /> }

export const InlineSpinner: Story = {
    render: () => (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <LoadingSpinner />
            <span>Saving changes…</span>
        </div>
    ),
}

export const CardGrid: Story = {
    render: () => (
        <div className="grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
            <AccountBalanceSkeleton />
            <AccountBalanceSkeleton />
        </div>
    ),
}
