import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
        baseURL: 'http://localhost:5182',
        trace: 'on-first-retry',
    },
    projects: [
        {
            name: 'chromium',
            testIgnore: /mobile-smoke\.spec\.ts/,
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'mobile-chromium-smoke',
            testMatch: /mobile-smoke\.spec\.ts/,
            use: { ...devices['Pixel 5'] },
        },
    ],
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:5182',
        reuseExistingServer: !process.env.CI,
        env: {
            BROWSER: 'none',
        },
    },
})
