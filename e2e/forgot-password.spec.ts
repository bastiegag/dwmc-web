import { test, expect } from '@playwright/test'

test.describe('Forgot password page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/forgot-password')
    })

    test('shows the forgot password form', async ({ page }) => {
        await expect(page.getByRole('heading', { name: /forgot password/i })).toBeVisible()
        await expect(page.getByLabel('Email')).toBeVisible()
        await expect(page.getByRole('button', { name: /send reset link/i })).toBeVisible()
    })

    test('shows a validation error for an invalid email', async ({ page }) => {
        await page.getByLabel('Email').fill('notanemail')
        await page.getByRole('button', { name: /send reset link/i }).click()
        await expect(page.getByText(/valid email address/i)).toBeVisible()
    })

    test('shows a success message after submitting a valid email', async ({ page }) => {
        await page.route(/\/auth\/v1\/recover/, (route) =>
            route.fulfill({ status: 200, contentType: 'application/json', body: '{}' }),
        )

        await page.getByLabel('Email').fill('test@example.com')
        await page.getByRole('button', { name: /send reset link/i }).click()

        await expect(page.getByText(/password reset link sent/i)).toBeVisible()
    })

    test('"Back to sign in" link navigates to /login after success', async ({ page }) => {
        await page.route(/\/auth\/v1\/recover/, (route) =>
            route.fulfill({ status: 200, contentType: 'application/json', body: '{}' }),
        )

        await page.getByLabel('Email').fill('test@example.com')
        await page.getByRole('button', { name: /send reset link/i }).click()
        await page.getByRole('link', { name: /back to sign in/i }).click()

        await expect(page).toHaveURL('/login')
    })
})
