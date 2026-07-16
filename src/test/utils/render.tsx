import { type ReactNode } from 'react'
import { render, renderHook, type RenderOptions } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PrimaryActionProvider } from '@/shared/primary-action'

const createTestQueryClient = () => {
    return new QueryClient({
        defaultOptions: {
            queries: { retry: false, gcTime: 0 },
            mutations: { retry: false },
        },
    })
}

const TestWrapper = ({
    children,
    initialEntries = ['/'],
}: {
    children: ReactNode
    initialEntries?: string[]
}) => {
    const testQueryClient = createTestQueryClient()
    return (
        <QueryClientProvider client={testQueryClient}>
            <PrimaryActionProvider>
                <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
            </PrimaryActionProvider>
        </QueryClientProvider>
    )
}

const customRender = (
    ui: React.ReactElement,
    options?: Omit<RenderOptions, 'wrapper'> & { initialEntries?: string[] },
) => {
    const { initialEntries, ...renderOptions } = options ?? {}
    return render(ui, {
        wrapper: ({ children }) => (
            <TestWrapper initialEntries={initialEntries}>{children}</TestWrapper>
        ),
        ...renderOptions,
    })
}

export * from '@testing-library/react'
export { customRender as render }

export const MonthLocationProbe = () => {
    const location = useLocation()

    return (
        <output data-testid="location-probe">
            {location.pathname}
            {location.search}
        </output>
    )
}

export const renderMonthAwareNavigation = (
    ui: React.ReactElement,
    month: string,
    initialPath = '/dashboard',
) => {
    return customRender(
        <>
            {ui}
            <MonthLocationProbe />
        </>,
        { initialEntries: [`${initialPath}?month=${month}`] },
    )
}

export const renderHookWithQuery = <Result,>(
    hook: () => Result,
    options?: { setupClient?: (qc: QueryClient) => void },
) => {
    const testQueryClient = createTestQueryClient()
    options?.setupClient?.(testQueryClient)

    return {
        ...renderHook(hook, {
            wrapper: ({ children }: { children: ReactNode }) => (
                <QueryClientProvider client={testQueryClient}>{children}</QueryClientProvider>
            ),
        }),
        qc: testQueryClient,
    }
}
