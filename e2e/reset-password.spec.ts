import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { mockPasswordRecoverySession, recoveryHash } from './auth-fixtures'

test.describe('Reset password page', () => {
    // Direct navigation without a recovery token lands on the invalid-link state.
    // Testing the valid recovery flow would require a real Supabase PKCE token —
    // that is covered by component-level tests via mocked hooks instead.
    test.beforeEach(async ({ page }, testInfo) => {
        if (!testInfo.title.includes('valid recovery')) {
            await page.goto('/reset-password')
        }
    })

    test('shows the invalid-link card on direct navigation', async ({ page }) => {
        await expect(page.getByRole('heading', { name: /link expired or invalid/i })).toBeVisible()
        await expect(
            page.getByRole('link', { name: /request a new password reset/i }),
        ).toBeVisible()
    })

    test('allows a valid recovery session to update the password', async ({ page }) => {
        await mockPasswordRecoverySession(page)
        await page.goto(`/reset-password${recoveryHash()}`)

        await expect(page.locator('h2').filter({ hasText: 'Reset your password' })).toBeVisible()
        await page.locator('#password').fill('NewPassword123')
        await page.locator('#confirmPassword').fill('NewPassword123')
        await page.getByRole('button', { name: /update password/i }).click()

        await expect(
            page.getByRole('status').getByText(/password updated successfully/i),
        ).toBeVisible()
    })

    test('"Request a new password reset" link navigates to /forgot-password', async ({ page }) => {
        await page.getByRole('link', { name: /request a new password reset/i }).click()
        await expect(page).toHaveURL('/forgot-password')
    })

    test('has no accessibility violations on the invalid-link state', async ({ page }) => {
        await page.waitForSelector('main')
        const results = await new AxeBuilder({ page }).analyze()
        expect(results.violations).toEqual([])
    })
})
