import { expect, test } from '@playwright/test'
import { mockAuthenticatedSession } from './auth-fixtures.js'
import { LoginPage } from './pages/login.page.js'

test('mobile users can navigate and safely cancel a transaction form', async ({ page }) => {
    await mockAuthenticatedSession(page)

    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.login('test@example.com', 'Password123')

    await expect(page.getByTestId('mobile-bottom-nav')).toBeVisible()
    await page.getByTestId('mobile-bottom-nav').getByRole('link', { name: 'Transactions' }).click()
    await expect(page).toHaveURL(/\/transactions/)

    await page.getByTestId('primary-action-button').click()
    const dialog = page.getByRole('dialog', { name: 'New Transaction' })
    await expect(dialog).toBeVisible()
    await dialog.getByRole('button', { name: 'Close transaction dialog' }).click()
    await expect(dialog).not.toBeVisible()
})
