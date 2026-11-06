import type { Meta, StoryObj } from '@storybook/react-vite'
import { Skeleton } from './Skeleton'

const meta = {
    title: 'Design System/Components/Feedback/Skeleton',
    component: Skeleton,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component:
                    'Placeholder block shown while content loads. Size and shape come from `className`. Skeletons are decorative, so pair them with a visible or announced loading state where the content is important.',
            },
        },
    },
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Text: Story = {
    render: () => (
        <div className="w-72 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
        </div>
    ),
}

export const Card: Story = {
    render: () => (
        <div className="w-72 space-y-3 rounded-lg border p-4">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-8 w-24" />
        </div>
    ),
}

export const AccountBalance: Story = {
    render: () => (
        <div className="w-64 space-y-2 rounded-lg border p-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-36" />
        </div>
    ),
}

export const TransactionList: Story = {
    render: () => (
        <ul className="w-96 space-y-3">
            {Array.from({ length: 4 }, (_, index) => (
                <li key={index} className="flex items-center justify-between gap-4">
                    <div className="space-y-1.5">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                </li>
            ))}
        </ul>
    ),
}
