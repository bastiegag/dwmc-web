import type { Meta, StoryObj } from '@storybook/react-vite'
import EmptyTransactionsState from './EmptyTransactionsState'

const meta = {
    title: 'Design System/Product/Transactions/Empty Transactions State',
    component: EmptyTransactionsState,
    tags: ['autodocs'],
} satisfies Meta<typeof EmptyTransactionsState>

export default meta
type Story = StoryObj<typeof meta>

export const EmptyResults: Story = {}
