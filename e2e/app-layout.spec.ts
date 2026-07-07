import { test, expect } from '@playwright/test'
import { LoginPage } from './pages/login.page.js'

test.describe('App Layout', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page)
        await loginPage.goto()
        await loginPage.login('test@example.com', 'Password123')
        await expect(page).toHaveURL('/app/dashboard')
    })

    test.describe('Mobile viewport', () => {
        test.use({ viewport: { width: 375, height: 667 } })

        test('shows the mobile bottom navigation', async ({ page }) => {
            await expect(page.getByTestId('mobile-bottom-nav')).toBeVisible()
            await expect(page.getByTestId('desktop-sidebar')).not.toBeVisible()
        })

        test('floating action button opens the transaction dialog on the dashboard', async ({
            page,
        }) => {
            await page.getByTestId('primary-action-button').click()
            await expect(page.getByRole('heading', { name: 'New Transaction' })).toBeVisible()
        })

        test('floating action button opens the budget dialog on the budgets page', async ({
            page,
        }) => {
            await page.goto('/app/budgets')
            await page.getByTestId('primary-action-button').click()
            await expect(page.getByRole('heading', { name: 'New Budget' })).toBeVisible()
        })
    })

    test.describe('Desktop viewport', () => {
        test.use({ viewport: { width: 1280, height: 720 } })

        test('shows the desktop sidebar', async ({ page }) => {
            await expect(page.getByTestId('desktop-sidebar')).toBeVisible()
            await expect(page.getByTestId('mobile-bottom-nav')).not.toBeVisible()
        })

        test('month navigator updates the URL', async ({ page }) => {
            const currentMonth = new Date()
            const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
            const year = nextMonth.getFullYear()
            const month = (nextMonth.getMonth() + 1).toString().padStart(2, '0')

            await page.getByLabel('Go to next month').click()
            await expect(page).toHaveURL(`/app/dashboard?month=${year}-${month}`)
        })
    })
})
