import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/shared/theme'
import { toast } from 'sonner'

const meta = {
    title: 'UI/Toaster',
    component: Toaster,
    tags: ['autodocs'],
} satisfies Meta<typeof Toaster>

export default meta
type Story = StoryObj<typeof meta>

export const Interactive: Story = {
    render: () => (
        <ThemeProvider defaultTheme="light" storageKey="storybook-theme">
            <div className="flex flex-wrap gap-2">
                <Button type="button" onClick={() => toast.success('Transaction saved')}>
                    Show success toast
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => toast.error('Unable to save transaction')}
                >
                    Show error toast
                </Button>
            </div>
            <Toaster />
        </ThemeProvider>
    ),
}
