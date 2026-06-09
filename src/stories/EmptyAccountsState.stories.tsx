import type { Meta, StoryObj } from '@storybook/react-vite'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { EmptyAccountsState } from '@/features/accounts/components/EmptyAccountsState'

const meta: Meta<typeof EmptyAccountsState> = {
    title: 'Accounts/EmptyAccountsState',
    component: EmptyAccountsState,
    decorators: [
        (Story) => (
            <QueryClientProvider client={new QueryClient()}>
                <MemoryRouter>
                    <div className="p-6 max-w-md">
                        <Story />
                    </div>
                </MemoryRouter>
            </QueryClientProvider>
        ),
    ],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { onCreate: () => {} } }
