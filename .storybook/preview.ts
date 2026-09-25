/// <reference types="vite/client" />

import type { Preview } from '@storybook/react'
import { withThemeByClassName } from '@storybook/addon-themes'
import { initialize, mswLoader } from 'msw-storybook-addon'
import '../src/styles/globals.css'

// Bypass requests with no handler so real API calls still work in dev
initialize({ onUnhandledRequest: 'bypass' })

const preview: Preview = {
    initialGlobals: {
        theme: 'light',
    },
    decorators: [
        withThemeByClassName({
            themes: {
                light: '',
                dark: 'dark',
            },
            defaultTheme: 'light',
            parentSelector: 'html',
        }),
    ],
    loaders: [mswLoader],
    parameters: {
        backgrounds: { disable: true },
        layout: 'centered',
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        docs: {
            codePanel: true,
            source: {
                type: 'dynamic',
            },
        },
    },
}

export default preview
