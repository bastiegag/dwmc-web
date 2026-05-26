import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Signup page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/signup')
    })

    test('shows the create account form', async ({ page }) => {
        await expect(page.getByRole('heading', { name: /create an account/i })).toBeVisible()
        await expect(page.getByLabel('Email')).toBeVisible()
        await expect(page.locator('#password')).toBeVisible()
        await expect(page.locator('#confirmPassword')).toBeVisible()
        await expect(page.getByRole('button', { name: /create account/i })).toBeVisible()
    })

    test('shows a validation error when submitted empty', async ({ page }) => {
        await page.getByRole('button', { name: /create account/i }).click()
        await expect(page.getByText(/email is required/i)).toBeVisible()
    })

    test('shows an error when passwords do not match', async ({ page }) => {
        await page.getByLabel('Email').fill('test@example.com')
        await page.locator('input[name="password"]').fill('Password123')
        await page.locator('input[name="confirmPassword"]').fill('Different123')
        await page.getByRole('button', { name: /create account/i }).click()
        await expect(page.getByText(/passwords do not match/i)).toBeVisible()
    })

    test('shows a success message after account creation', async ({ page }) => {
        await page.route(/\/auth\/v1\/signup/, (route) =>
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    id: 'new-user-id',
                    email: 'new@example.com',
                    aud: 'authenticated',
                    created_at: new Date().toISOString(),
                }),
            }),
        )

        await page.getByLabel('Email').fill('new@example.com')
        await page.locator('input[name="password"]').fill('Password123')
        await page.locator('input[name="confirmPassword"]').fill('Password123')
        await page.getByRole('button', { name: /create account/i }).click()

        await expect(page.getByText(/please check your email to verify/i)).toBeVisible()
    })

    test('"Sign in" link navigates to /login', async ({ page }) => {
        await page.getByRole('link', { name: /sign in/i }).click()
        await expect(page).toHaveURL('/login')
    })

    test('has no accessibility violations', async ({ page }) => {
        const results = await new AxeBuilder({ page }).analyze()
        expect(results.violations).toEqual([])
    })
})
