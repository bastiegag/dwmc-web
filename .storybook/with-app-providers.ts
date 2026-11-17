import { createElement, useState, type ReactNode } from 'react'
import type { Decorator } from '@storybook/react-vite'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'

const AppStoryProviders = ({ children }: { children: ReactNode }) => {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: { retry: false },
                    mutations: { retry: false },
                },
            }),
    )

    return createElement(
        QueryClientProvider,
        { client: queryClient },
        createElement(MemoryRouter, null, children),
    )
}

export const withAppProviders: Decorator = (Story) =>
    createElement(AppStoryProviders, null, createElement(Story))
