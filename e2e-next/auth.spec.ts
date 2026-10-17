import { expect, test } from '@playwright/test'

test.describe('Next.js authentication boundary', () => {
    test('renders login validation and links', async ({ page }) => {
        await page.goto('/login')
        await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible()
        await page.getByRole('button', { name: 'Sign in' }).click()
        await expect(page.getByText('Email is required')).toBeVisible()
        await expect(page.getByRole('link', { name: 'Sign up' })).toHaveAttribute('href', '/signup')
        await expect(page.getByRole('link', { name: 'Forgot password?' })).toHaveAttribute(
            'href',
            '/forgot-password',
        )
    })

    test('renders signup and forgot-password validation flows', async ({ page }) => {
        await page.goto('/signup')
        await expect(page.getByRole('heading', { name: 'Create account' })).toBeVisible()
        await page.getByRole('button', { name: 'Create account' }).click()
        await expect(page.getByText('Email is required')).toBeVisible()

        await page.goto('/forgot-password')
        await page.getByRole('button', { name: 'Send reset link' }).click()
        await expect(page.getByText('Email is required')).toBeVisible()
    })

    test('shows the invalid reset-link state without a recovery marker', async ({ page }) => {
        await page.goto('/reset-password')
        await expect(page.getByRole('heading', { name: 'Link expired or invalid' })).toBeVisible()
        await expect(page.getByRole('link', { name: 'Request a new password reset' })).toBeVisible()
    })

    test('redirects anonymous users before protected rendering', async ({ page }) => {
        await page.goto('/transactions?month=2026-06')
        await expect(page).toHaveURL('/login?next=%2Ftransactions%3Fmonth%3D2026-06')
        await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible()
    })

    test('authenticates, forwards the server request, persists on refresh, and logs out', async ({
        page,
    }) => {
        await page.goto('/login')
        await page.getByLabel('Email').fill('alice@example.com')
        await page.getByRole('textbox', { name: 'Password' }).fill('Password1')
        await page.getByRole('button', { name: 'Sign in' }).click()

        await expect(page).toHaveURL(/\/dashboard$/)
        await expect(page.getByRole('heading', { name: /No activity this month/i })).toBeVisible()
        await page.reload()
        await expect(page.getByRole('heading', { name: /No activity this month/i })).toBeVisible()

        await page.getByRole('button', { name: 'Sign out' }).click()
        await expect(page).toHaveURL(/\/login$/)
        await page.goto('/dashboard')
        await expect(page).toHaveURL(/\/login\?next=%2Fdashboard$/)
    })

    test('does not reuse user A session or rendered data for user B', async ({ page }) => {
        await page.goto('/login')
        await page.getByLabel('Email').fill('alice@example.com')
        await page.getByRole('textbox', { name: 'Password' }).fill('Password1')
        await page.getByRole('button', { name: 'Sign in' }).click()
        await expect(page).toHaveURL(/\/dashboard$/)

        await page.getByRole('button', { name: 'Sign out' }).click()
        await expect(page).toHaveURL(/\/login$/)
        await page.goto('/login')
        await page.getByLabel('Email').fill('bob@example.com')
        await page.getByRole('textbox', { name: 'Password' }).fill('Password1')
        await page.getByRole('button', { name: 'Sign in' }).click()

        await expect(page).toHaveURL(/\/dashboard$/)
        await expect(page.getByRole('heading', { name: /No activity this month/i })).toBeVisible()
    })

    test('handles callback errors and rejects unsafe redirect destinations', async ({ page }) => {
        await page.goto('/auth/callback?next=https%3A%2F%2Fevil.example')
        await expect(page).toHaveURL(/\/login\?error=missing_callback$/)

        await page.goto('/auth/callback?code=invalid&next=%2Ftransactions%3Fmonth%3D2026-06')
        await expect(page).toHaveURL(/\/login\?error=invalid_callback$/)
    })
})
