import type { Meta, StoryObj } from '@storybook/react-vite'
import { Inbox } from 'lucide-react'
import { EmptyState } from './empty-state'

const meta = {
    title: 'Design System/Patterns/Empty States/Empty State',
    component: EmptyState,
    tags: ['autodocs'],
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        icon: Inbox,
        title: 'No transactions yet',
        description: 'Add your first transaction to start tracking everyday spending.',
    },
}
