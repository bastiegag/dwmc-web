import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { PaginationControls } from './PaginationControls'

const meta = {
    title: 'Design System/Product/Transactions/Transaction Pagination',
    component: PaginationControls,
    tags: ['autodocs'],
    args: { onPageChange: fn() },
} satisfies Meta<typeof PaginationControls>

export default meta
type Story = StoryObj<typeof meta>

export const FirstPage: Story = { args: { page: 1, totalPages: 4, total: 82 } }
export const MiddlePage: Story = { args: { page: 2, totalPages: 4, total: 82 } }
export const LastPage: Story = { args: { page: 4, totalPages: 4, total: 82 } }
