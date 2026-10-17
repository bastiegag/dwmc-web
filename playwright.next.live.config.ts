import { config as loadEnv } from 'dotenv'
import { defineConfig, devices } from '@playwright/test'

loadEnv({ path: '.env.local' })
loadEnv({ path: '.env' })

const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'DWMC_API_URL',
    'E2E_TEST_EMAIL',
    'E2E_TEST_PASSWORD',
]
const missing = required.filter((name) => !process.env[name])

if (missing.length > 0) {
    throw new Error(
        `Live Next.js E2E tests require: ${missing.join(', ')}. ` +
            'Use dedicated non-production Supabase/API test credentials.',
    )
}

export default defineConfig({
    testDir: './e2e-next-live',
    fullyParallel: false,
    forbidOnly: true,
    retries: process.env.CI ? 2 : 0,
    workers: 1,
    reporter: 'html',
    use: {
        baseURL: 'http://127.0.0.1:5182',
        trace: 'on-first-retry',
    },
    projects: [
        {
            name: 'next-live-chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
    webServer: {
        command: 'npm run build && npm run start',
        url: 'http://127.0.0.1:5182',
        reuseExistingServer: false,
        timeout: 120_000,
        env: {
            NEXT_PUBLIC_APP_URL: 'http://127.0.0.1:5182',
            NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
            NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            DWMC_API_URL: process.env.DWMC_API_URL,
        },
    },
})
