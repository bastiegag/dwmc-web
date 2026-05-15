import { type ReactNode } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

function createTestQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: { retry: false, gcTime: 0 },
            mutations: { retry: false },
        },
    })
}

// eslint-disable-next-line react-refresh/only-export-components
function TestWrapper({
    children,
    initialEntries = ['/'],
}: {
    children: ReactNode
    initialEntries?: string[]
}) {
    const testQueryClient = createTestQueryClient()
    return (
        <QueryClientProvider client={testQueryClient}>
            <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
        </QueryClientProvider>
    )
}

function customRender(
    ui: React.ReactElement,
    options?: Omit<RenderOptions, 'wrapper'> & { initialEntries?: string[] },
) {
    const { initialEntries, ...renderOptions } = options ?? {}
    return render(ui, {
        wrapper: ({ children }) => (
            <TestWrapper initialEntries={initialEntries}>{children}</TestWrapper>
        ),
        ...renderOptions,
    })
}

// eslint-disable-next-line react-refresh/only-export-components
export * from '@testing-library/react'
export { customRender as render }
