import type { Meta, StoryObj } from '@storybook/react-vite'
import { Separator } from './Separator'

const meta = {
    title: 'Design System/Components/Surfaces/Separator',
    component: Separator,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component:
                    'Visual divider. It is decorative by default (`role="none"`). Set `decorative={false}` when the divider separates meaningful regions, so assistive technology announces it as a `separator`.',
            },
        },
    },
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
    render: () => (
        <div className="w-72 space-y-3">
            <p>Checking</p>
            <Separator />
            <p>Savings</p>
        </div>
    ),
}

export const Vertical: Story = {
    render: () => (
        <div className="flex h-12 items-center gap-4">
            <span>Before</span>
            <Separator orientation="vertical" />
            <span>After</span>
        </div>
    ),
}

export const Semantic: Story = {
    name: 'Semantic (non-decorative)',
    render: () => (
        <div className="w-72 space-y-3">
            <p>Income</p>
            <Separator decorative={false} />
            <p>Expenses</p>
        </div>
    ),
}
