import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    define: {
        'import.meta.env.VITE_SUPABASE_URL': '"https://test.supabase.co"',
        'import.meta.env.VITE_SUPABASE_ANON_KEY': '"test-anon-key"',
        'import.meta.env.VITE_APP_URL': '"http://localhost:5182"',
    },
    test: {
        globals: true,
        coverage: {
            reporter: ['text', 'json', 'html'],
            exclude: ['node_modules/', 'src/test/', '*.config.*', 'src/stories/'],
            thresholds: {
                statements: 75,
                branches: 65,
                functions: 75,
                lines: 80,
            },
        },
        projects: [
            // Unit / component tests (jsdom)
            {
                extends: true,
                test: {
                    name: 'unit',
                    environment: 'jsdom',
                    setupFiles: ['./src/test/setup.ts'],
                    include: ['src/**/*.{test,spec}.{ts,tsx}'],
                    exclude: ['node_modules/**', 'e2e/**'],
                },
            },
            // Storybook stories run as Vitest browser tests
            {
                extends: true,
                plugins: [storybookTest({ configDir: '.storybook' })],
                test: {
                    name: 'storybook',
                    browser: {
                        enabled: true,
                        headless: true,
                        provider: playwright({}),
                        instances: [{ browser: 'chromium' }],
                    },
                },
            },
        ],
    },
})
