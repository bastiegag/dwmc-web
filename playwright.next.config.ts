import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
    testDir: './e2e-next',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
        baseURL: 'http://127.0.0.1:5182',
        trace: 'on-first-retry',
    },
    projects: [
        {
            name: 'next-chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
    webServer: [
        {
            command: 'node e2e-next/mock-boundary.mjs',
            url: 'http://127.0.0.1:8790/health',
            reuseExistingServer: false,
            timeout: 30_000,
        },
        {
            command: 'npm run dev',
            url: 'http://127.0.0.1:5182',
            reuseExistingServer: false,
            timeout: 120_000,
            env: {
                NEXT_PUBLIC_APP_URL: 'http://127.0.0.1:5182',
                NEXT_PUBLIC_SUPABASE_URL: 'http://127.0.0.1:8790',
                NEXT_PUBLIC_SUPABASE_ANON_KEY: 'next-e2e-public-key',
                DWMC_API_URL: 'http://127.0.0.1:8790/api/v1',
            },
        },
    ],
})
