import type { Meta, StoryObj } from '@storybook/react-vite'
import { Progress } from './progress'

const meta = {
    title: 'Design System/Components/Feedback/Progress',
    component: Progress,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
    },
    argTypes: {
        value: {
            control: { type: 'number', min: 0, max: 100, step: 1 },
        },
        color: {
            control: 'select',
            options: [
                'default',
                'primary',
                'secondary',
                'destructive',
                'warning',
                'success',
                'info',
            ],
        },
    },
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: { value: 65, 'aria-label': 'Budget progress' },
}

export const NotStarted: Story = {
    args: { value: 0, 'aria-label': 'Budget progress' },
}

export const Complete: Story = {
    args: { value: 100, 'aria-label': 'Budget progress' },
}

const colors = [
    'default',
    'primary',
    'secondary',
    'destructive',
    'warning',
    'success',
    'info',
] as const

export const Colors: Story = {
    render: () => (
        <div className="grid w-full gap-4">
            {colors.map((color) => (
                <div key={color} className="space-y-1">
                    <div className="text-sm capitalize">{color}</div>
                    <Progress value={65} color={color} aria-label={`${color} progress`} />
                </div>
            ))}
        </div>
    ),
}
