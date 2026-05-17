import { test, expect } from '@playwright/test'

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
})
