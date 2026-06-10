import type { Meta, StoryObj } from '@storybook/react-vite'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { AccountForm } from '@/features/accounts/components/AccountForm'
import type { AccountFormValues } from '@/features/accounts/schemas/account.schema'

const meta: Meta<typeof AccountForm> = {
    title: 'Accounts/AccountForm',
    component: AccountForm,
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

const defaultValues: AccountFormValues = {
    name: '',
    type: 'CHECKING',
    startingBalance: 0,
    goal: null,
    color: '#3b82f6',
    icon: 'wallet',
}

export const Default: Story = {
    args: {
        initialValues: defaultValues,
        submitLabel: 'Create account',
        isPending: false,
        onSubmit: async () => {},
    },
}
