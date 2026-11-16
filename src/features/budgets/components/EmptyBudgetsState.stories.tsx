import type { Meta, StoryObj } from '@storybook/react-vite'
import { EmptyBudgetsState } from './EmptyBudgetsState'

const meta = {
    title: 'Design System/Product/Budgets/Empty Budgets State',
    component: EmptyBudgetsState,
    tags: ['autodocs'],
} satisfies Meta<typeof EmptyBudgetsState>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = { args: { month: '2026-06' } }
