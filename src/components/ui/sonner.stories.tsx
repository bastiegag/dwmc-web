import type { Meta, StoryObj } from '@storybook/react-vite'
import { toast } from 'sonner'
import { Button } from './button'
import { Toaster } from './sonner'
import { ThemeProvider } from '@/shared/theme'

const meta = {
    title: 'Design System/Components/Feedback/Toaster',
    component: Toaster,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <ThemeProvider defaultTheme="light">
                <Story />
            </ThemeProvider>
        ),
    ],
} satisfies Meta<typeof Toaster>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => (
        <div>
            <Toaster />
            <Button onClick={() => toast('Transaction saved')}>Show notification</Button>
        </div>
    ),
}

export const Success: Story = {
    render: () => (
        <div>
            <Toaster />
            <Button onClick={() => toast.success('Budget updated')}>Show success</Button>
        </div>
    ),
}

export const Error: Story = {
    render: () => (
        <div>
            <Toaster />
            <Button onClick={() => toast.error('Could not save transaction')}>Show error</Button>
        </div>
    ),
}
