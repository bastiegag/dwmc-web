import type { Meta, StoryObj } from '@storybook/react-vite'
import { Chart } from '@/components/ui/chart'

const data = [
    { month: 'Jan', amount: 420 },
    { month: 'Feb', amount: 610 },
    { month: 'Mar', amount: 480 },
    { month: 'Apr', amount: 735 },
]

const meta = {
    title: 'UI/Chart',
    component: Chart,
    tags: ['autodocs'],
    args: { data, xKey: 'month', yKey: 'amount' },
} satisfies Meta<typeof Chart>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
