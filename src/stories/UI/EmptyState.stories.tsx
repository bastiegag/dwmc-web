import type { Meta, StoryObj } from '@storybook/react-vite'
import { Inbox } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'

const meta = {
    title: 'UI/EmptyState',
    component: EmptyState,
    tags: ['autodocs'],
    args: {
        icon: Inbox,
        title: 'No transactions yet',
        description: 'Transactions added for this month will appear here.',
    },
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
