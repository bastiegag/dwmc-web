import type { Meta, StoryObj } from '@storybook/react-vite'
import MonthSelector from '@/features/dashboard/components/MonthSelector'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'

const meta: Meta<typeof MonthSelector> = {
    title: 'Dashboard/MonthSelector',
    component: MonthSelector,
    decorators: [
        (Story) => (
            <QueryClientProvider client={new QueryClient()}>
                <MemoryRouter>
                    <div className="p-6 max-w-sm">
                        <Story />
                    </div>
                </MemoryRouter>
            </QueryClientProvider>
        ),
    ],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: { month: new Date().toISOString().slice(0, 7), onChange: () => {} },
}
