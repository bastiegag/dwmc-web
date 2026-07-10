import type { Meta, StoryObj } from '@storybook/react-vite'
import MonthSelector from '@/features/dashboard/components/MonthSelector'
import { withCompactLayout, withQueryClient, withRouter } from '../decorators'

const meta: Meta<typeof MonthSelector> = {
    title: 'Dashboard/MonthSelector',
    component: MonthSelector,
    decorators: [withQueryClient, withRouter, withCompactLayout],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: { month: new Date().toISOString().slice(0, 7), onChange: () => {} },
}
