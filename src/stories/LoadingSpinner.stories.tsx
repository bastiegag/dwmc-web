import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner'

const meta: Meta<typeof LoadingSpinner> = {
    title: 'Feedback/LoadingSpinner',
    component: LoadingSpinner,
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Small: Story = {
    args: { size: 'sm' },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await expect(canvas.getByRole('status')).toBeVisible()
    },
}

export const Medium: Story = {
    args: { size: 'md' },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await expect(canvas.getByRole('status')).toBeVisible()
    },
}

export const Large: Story = {
    args: { size: 'lg' },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await expect(canvas.getByRole('status')).toBeVisible()
    },
}

export const CustomLabel: Story = {
    args: { 'aria-label': 'Saving changes' },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await expect(canvas.getByRole('status', { name: 'Saving changes' })).toBeVisible()
    },
}
