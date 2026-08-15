import { test, expect } from '@playwright/test'
import { LoginPage } from './pages/login.page.js'
import { mockAuthenticatedSession } from './auth-fixtures.js'

test.describe('Settings', () => {
    test('changes the theme and preserves it after refresh', async ({ page }) => {
        await mockAuthenticatedSession(page)

        const loginPage = new LoginPage(page)
        await loginPage.goto()
        await loginPage.login('test@example.com', 'Password123')
        await page.getByRole('link', { name: 'Tools' }).click()
        await page.getByRole('link', { name: /Settings/ }).click()

        await expect(page).toHaveURL(/\/tools\/settings/)
        await expect(page.getByRole('heading', { name: 'Settings', level: 1 })).toBeVisible()
        await page.getByRole('radio', { name: /Dark/ }).click()
        await expect(page.locator('html')).toHaveClass(/dark/)

        await page.reload()

        await expect(page.getByRole('radio', { name: /Dark/ })).toBeChecked()
        await expect(page.locator('html')).toHaveClass(/dark/)
    })
})
