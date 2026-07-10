import { type Decorator } from '@storybook/react-vite'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'

const createStoryQueryClient = () =>
    new QueryClient({
        defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    })

export const withQueryClient: Decorator = (Story) => (
    <QueryClientProvider client={createStoryQueryClient()}>
        <Story />
    </QueryClientProvider>
)

export const withRouter: Decorator = (Story) => (
    <MemoryRouter>
        <Story />
    </MemoryRouter>
)

export const withCenteredLayout: Decorator = (Story) => (
    <div className="mx-auto max-w-md p-6">
        <Story />
    </div>
)

export const withCompactLayout: Decorator = (Story) => (
    <div className="p-6 max-w-sm">
        <Story />
    </div>
)
