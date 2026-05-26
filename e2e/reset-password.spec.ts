import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Reset password page', () => {
    // Direct navigation without a recovery token lands on the invalid-link state.
    // Testing the valid recovery flow would require a real Supabase PKCE token —
    // that is covered by component-level tests via mocked hooks instead.
    test.beforeEach(async ({ page }) => {
        await page.goto('/reset-password')
    })

    test('shows the invalid-link card on direct navigation', async ({ page }) => {
        await expect(page.getByRole('heading', { name: /link expired or invalid/i })).toBeVisible()
        await expect(
            page.getByRole('link', { name: /request a new password reset/i }),
        ).toBeVisible()
    })

    test('"Request a new password reset" link navigates to /forgot-password', async ({ page }) => {
        await page.getByRole('link', { name: /request a new password reset/i }).click()
        await expect(page).toHaveURL('/forgot-password')
    })

    test('has no accessibility violations on the invalid-link state', async ({ page }) => {
        const results = await new AxeBuilder({ page }).analyze()
        expect(results.violations).toEqual([])
    })
})
