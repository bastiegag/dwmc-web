import type { Meta, StoryObj } from '@storybook/react-vite'
import { Progress } from './progress'

const meta = {
    title: 'Design System/Components/Feedback/Progress',
    component: Progress,
    tags: ['autodocs'],
    argTypes: {
        value: {
            control: { type: 'number', min: 0, max: 100, step: 1 },
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
