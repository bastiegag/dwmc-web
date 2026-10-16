import type { StorybookConfig } from '@storybook/nextjs-vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const config: StorybookConfig = {
    stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    addons: [
        '@storybook/addon-a11y',
        '@storybook/addon-themes',
        '@storybook/addon-docs',
        '@storybook/addon-vitest',
    ],
    framework: {
        name: '@storybook/nextjs-vite',
        options: {
            nextConfigPath: path.resolve(__dirname, '../next.config.ts'),
        },
    },
    viteFinal: async (config) => {
        if (config.resolve) {
            config.resolve.alias = {
                ...config.resolve.alias,
                '@': path.resolve(__dirname, '../src'),
            }
        }
        config.define = {
            ...config.define,
            'import.meta.env.VITE_SUPABASE_URL': '"https://test.supabase.co"',
            'import.meta.env.VITE_SUPABASE_ANON_KEY': '"test-anon-key"',
            'import.meta.env.VITE_APP_URL': '"http://localhost:6006"',
        }
        return config
    },
}

export default config
