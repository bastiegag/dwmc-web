import type { Meta, StoryObj } from '@storybook/react-vite'
import { Chart } from './chart'

const data = [
    { month: 'Apr', amount: 320 },
    { month: 'May', amount: 450 },
    { month: 'Jun', amount: 380 },
    { month: 'Jul', amount: 520 },
    { month: 'Aug', amount: 410 },
]

const meta = {
    title: 'Design System/Components/Data Display/Chart',
    component: Chart,
    tags: ['autodocs'],
} satisfies Meta<typeof Chart>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        data,
        xKey: 'month',
        yKey: 'amount',
    },
    render: () => (
        <div style={{ width: 640 }}>
            <Chart data={data} xKey="month" yKey="amount" />
        </div>
    ),
}
