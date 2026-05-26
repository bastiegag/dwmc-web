import type { Preview } from '@storybook/react'
import { initialize, mswLoader } from 'msw-storybook-addon'
import '../src/styles/globals.css'

// Bypass requests with no handler so real API calls still work in dev
initialize({ onUnhandledRequest: 'bypass' })

const preview: Preview = {
    loaders: [mswLoader],
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
}

export default preview
