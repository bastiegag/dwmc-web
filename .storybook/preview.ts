/// <reference types="vite/client" />

import type { Preview } from '@storybook/react'
import { withThemeByClassName } from '@storybook/addon-themes'
import { mswLoader } from 'msw-storybook-addon/csf3'
import '../src/styles/globals.css'

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
    loaders: [mswLoader()],
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
