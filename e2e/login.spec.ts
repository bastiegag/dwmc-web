import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const MOCK_SESSION = {
    access_token: 'mock-access-token',
    token_type: 'bearer',
    expires_in: 3600,
    refresh_token: 'mock-refresh-token',
    user: {
        id: 'mock-user-id',
        email: 'test@example.com',
        aud: 'authenticated',
        created_at: new Date().toISOString(),
    },
}

test.describe('Login page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login')
    })

    test('shows the sign-in form', async ({ page }) => {
        await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible()
        await expect(page.getByLabel('Email')).toBeVisible()
        await expect(page.locator('#password')).toBeVisible()
        await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
    })

    test('shows a validation error when submitted empty', async ({ page }) => {
        await page.getByRole('button', { name: /sign in/i }).click()
        await expect(page.getByText(/email is required/i)).toBeVisible()
    })

    test('shows a validation error for an invalid email format', async ({ page }) => {
        await page.getByLabel('Email').fill('notanemail')
        await page.getByRole('button', { name: /sign in/i }).click()
        await expect(page.getByText(/valid email address/i)).toBeVisible()
    })

    test('"Forgot your password?" link navigates to /forgot-password', async ({ page }) => {
        await page.getByRole('link', { name: /forgot your password/i }).click()
        await expect(page).toHaveURL('/forgot-password')
    })

    test('"Sign up" link navigates to /signup', async ({ page }) => {
        await page.getByRole('link', { name: /sign up/i }).click()
        await expect(page).toHaveURL('/signup')
    })

    test('redirects to /app after successful login', async ({ page }) => {
        await page.route(/\/auth\/v1\/token/, (route) =>
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(MOCK_SESSION),
            }),
        )

        await page.getByLabel('Email').fill('test@example.com')
        await page.locator('#password').fill('Password123')
        await page.getByRole('button', { name: /sign in/i }).click()

        await expect(page).toHaveURL('/app')
    })

    test('shows an error for wrong credentials', async ({ page }) => {
        await page.route(/\/auth\/v1\/token/, (route) =>
            route.fulfill({
                status: 400,
                contentType: 'application/json',
                body: JSON.stringify({
                    error: 'invalid_grant',
                    error_description: 'Invalid login credentials',
                }),
            }),
        )

        await page.getByLabel('Email').fill('wrong@example.com')
        await page.locator('#password').fill('wrongpassword')
        await page.getByRole('button', { name: /sign in/i }).click()

        await expect(page.getByRole('alert').getByText(/invalid login credentials/i)).toBeVisible()
    })

    test('has no accessibility violations', async ({ page }) => {
        const results = await new AxeBuilder({ page }).analyze()
        expect(results.violations).toEqual([])
    })

    test('keyboard focus moves through email, password and submit in order', async ({ page }) => {
        // Start focus on the email field (first interactive element in the form)
        await page.getByLabel('Email').focus()
        await expect(page.getByLabel('Email')).toBeFocused()

        await page.keyboard.press('Tab')
        await expect(page.locator('#password')).toBeFocused()

        // Tab past the show-password toggle button
        await page.keyboard.press('Tab')
        await page.keyboard.press('Tab')
        await expect(page.getByRole('button', { name: /sign in/i })).toBeFocused()
    })
})
