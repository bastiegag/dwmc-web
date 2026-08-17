import { test, expect } from '@playwright/test'
import { LoginPage } from './pages/login.page.js'
import { mockAuthenticatedSession } from './auth-fixtures.js'

test.describe('Profile', () => {
    test('opens from Tools and persists an edited display name', async ({ page }) => {
        let displayName = 'Ada'

        await mockAuthenticatedSession(page)
        await page.route(/\/api\/v1\/profile$/, async (route) => {
            if (route.request().method() === 'PATCH') {
                const body = (await route.request().postDataJSON()) as {
                    displayName?: string | null
                }
                displayName = body.displayName ?? ''
            }
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    data: {
                        id: 'profile-1',
                        authUserId: 'mock-user-id',
                        firstName: 'Ada',
                        lastName: 'Lovelace',
                        displayName,
                        preferredCurrency: 'CAD',
                        createdAt: '2026-01-01T00:00:00.000Z',
                        updatedAt: '2026-01-01T00:00:00.000Z',
                    },
                }),
            })
        })

        const loginPage = new LoginPage(page)
        await loginPage.goto()
        await loginPage.login('test@example.com', 'Password123')
        await page.getByRole('link', { name: 'Tools' }).click()
        await page.getByRole('link', { name: /Profile/ }).click()

        await expect(page).toHaveURL(/\/tools\/profile/)
        await expect(page.getByRole('heading', { name: 'Profile', level: 1 })).toBeVisible()
        await page.getByLabel('Display name').fill('Countess')
        const patchResponse = page.waitForResponse(
            (response) =>
                response.url().endsWith('/api/v1/profile') &&
                response.request().method() === 'PATCH',
        )
        await page.getByRole('button', { name: 'Save changes' }).click()
        await expect((await patchResponse).ok()).toBeTruthy()

        await page.reload()
        await expect(page.getByLabel('Display name')).toHaveValue('Countess')
    })
})
