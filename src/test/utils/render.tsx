import { useState, type ReactNode } from 'react'
import { render, renderHook, type RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PrimaryActionProvider } from '@/shared/primary-action'
import { useSelectedMonth } from '@/shared/month'
import { TestMonthProvider } from '@/shared/month/providers/TestMonthProvider'
import { configureBrowserApiAdapter } from '@/lib/browser-api-adapter'

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
    const [testQueryClient] = useState(createTestQueryClient)
    const initialMonth =
        new URLSearchParams(initialEntries[0]?.split('?')[1]).get('month') ?? undefined
    configureBrowserApiAdapter({
        baseUrl: 'http://localhost:8787',
        getAccessToken: async () => undefined,
        onUnauthorized: async () => undefined,
    })
    return (
        <QueryClientProvider client={testQueryClient}>
            <PrimaryActionProvider>
                <TestMonthProvider initialMonth={initialMonth}>{children}</TestMonthProvider>
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

export const MonthLocationProbe = ({ initialPath }: { initialPath: string }) => {
    const { month } = useSelectedMonth()

    return (
        <output data-testid="location-probe">
            {initialPath}?month={month}
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
            <MonthLocationProbe initialPath={initialPath} />
        </>,
        { initialEntries: [`${initialPath}?month=${month}`] },
    )
}

export const renderHookWithQuery = <Result,>(
    hook: () => Result,
    options?: { setupClient?: (qc: QueryClient) => void },
) => {
    configureBrowserApiAdapter({
        baseUrl: 'http://localhost:8787',
        getAccessToken: async () => undefined,
        onUnauthorized: async () => undefined,
    })
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
