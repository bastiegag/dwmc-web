import { createElement, Fragment, useState, type ReactNode } from 'react'
import type { Decorator } from '@storybook/react-vite'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { Toaster } from '@/components/ui'
import { ThemeProvider } from '@/shared/theme'

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
        createElement(ThemeProvider, {
            defaultTheme: 'light',
            children: createElement(
                Fragment,
                null,
                createElement(MemoryRouter, null, children),
                createElement(Toaster),
            ),
        }),
    )
}

export const withAppProviders: Decorator = (Story) =>
    createElement(AppStoryProviders, null, createElement(Story))
