import { test, expect } from '@playwright/test'
import { mockAuthenticatedSession } from './auth-fixtures.js'
import { LoginPage } from './pages/login.page.js'

test('/ redirects to /login', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL('/login')
})

test('unknown path shows 404 page', async ({ page }) => {
    await page.goto('/unknown-path')
    await expect(page).toHaveURL('/unknown-path')
    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible()
})

test('/dashboard redirects to /login when not authenticated', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL('/login')
})

test('authenticated users are redirected away from anonymous-only routes', async ({ page }) => {
    await mockAuthenticatedSession(page)
    const loginPage = new LoginPage(page)

    await loginPage.goto()
    await loginPage.login('test@example.com', 'Password123')
    await expect(page).toHaveURL('/dashboard')

    await page.goto('/signup')
    await expect(page).toHaveURL('/dashboard')
})
