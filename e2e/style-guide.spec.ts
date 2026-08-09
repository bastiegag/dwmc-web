import { test, expect } from '@playwright/test'
import { LoginPage } from './pages/login.page.js'
import { mockAuthenticatedSession } from './auth-fixtures.js'

test.describe('Style Guide', () => {
    test.beforeEach(async ({ page }) => {
        await page.addInitScript(() => {
            localStorage.setItem('dwmc-theme', 'light')
        })

        await mockAuthenticatedSession(page)

        const loginPage = new LoginPage(page)
        await loginPage.goto()
        await loginPage.login('test@example.com', 'Password123')
        await expect(page).toHaveURL('/dashboard')
        await page.goto('/style-guide?month=2026-06')
    })

    test.describe('Mobile viewport', () => {
        test.use({ viewport: { width: 375, height: 667 } })

        test('renders the page and avoids horizontal overflow', async ({ page }) => {
            await expect(page.getByRole('heading', { name: 'Style Guide' })).toBeVisible()

            const themeToggle = page
                .locator('main')
                .getByRole('button', { name: 'Switch to dark mode' })
            await themeToggle.focus()
            await expect(themeToggle).toBeFocused()

            const overflow = await page.evaluate(() => ({
                scrollWidth: document.documentElement.scrollWidth,
                clientWidth: document.documentElement.clientWidth,
            }))
            expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth)
        })
    })

    test.describe('Desktop viewport', () => {
        test.use({ viewport: { width: 1280, height: 900 } })

        test('theme toggle and toast preview remain accessible', async ({ page }) => {
            const themeToggle = page
                .locator('main')
                .getByRole('button', { name: 'Switch to dark mode' })
            await themeToggle.click()
            await expect(page.locator('html')).toHaveClass(/dark/)

            await page.getByRole('button', { name: 'Trigger success toast' }).click()
            await expect(page.getByRole('heading', { name: 'Design tokens' })).toBeVisible()
        })
    })
})
