import { test, expect, type Page } from '@playwright/test'

const MOCK_USER = {
    id: 'mock-user-id',
    aud: 'authenticated',
    email: 'test@example.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
}

/**
 * Supabase implicit-flow recovery hash. The SDK parses access_token from the
 * hash, calls GET /auth/v1/user to validate it, then fires PASSWORD_RECOVERY —
 * which usePasswordRecovery converts to isValid: true.
 */
const RECOVERY_HASH =
    '#access_token=mock-access-token&refresh_token=mock-refresh-token&type=recovery&token_type=bearer&expires_in=3600'

/**
 * Registers a route handler for /auth/v1/user that fulfils GET requests with
 * the mock user. PUT requests fall through so individual tests can override them.
 */
async function mockUserGet(page: Page) {
    await page.route(/\/auth\/v1\/user/, (route) => {
        if (route.request().method() === 'GET') {
            return route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ user: MOCK_USER }),
            })
        }
        return route.continue()
    })
}

test.describe('Reset password page', () => {
    test.describe('without a recovery token', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('/reset-password')
        })

        test('shows an invalid state', async ({ page }) => {
            await expect(
                page.getByRole('heading', { name: /link expired or invalid/i }),
            ).toBeVisible()
            await expect(page.getByText(/invalid or has already been used/i)).toBeVisible()
        })

        test('"Request a new password reset" link navigates to /forgot-password', async ({
            page,
        }) => {
            await page.getByRole('link', { name: /request a new password reset/i }).click()
            await expect(page).toHaveURL('/forgot-password')
        })
    })

    test.describe('with a valid recovery token', () => {
        test.beforeEach(async ({ page }) => {
            await mockUserGet(page)
            await page.goto(`/reset-password${RECOVERY_HASH}`)
            await expect(page.getByRole('heading', { name: /reset your password/i })).toBeVisible()
        })

        test('shows the reset password form', async ({ page }) => {
            await expect(page.locator('#password')).toBeVisible()
            await expect(page.locator('#confirmPassword')).toBeVisible()
            await expect(page.getByRole('button', { name: /update password/i })).toBeVisible()
        })

        test('shows a validation error when submitted empty', async ({ page }) => {
            await page.getByRole('button', { name: /update password/i }).click()
            await expect(page.getByText(/at least 8 characters/i)).toBeVisible()
        })

        test('shows a validation error for a weak password', async ({ page }) => {
            await page.locator('#password').fill('weakpass')
            await page.locator('#confirmPassword').fill('weakpass')
            await page.getByRole('button', { name: /update password/i }).click()
            await expect(page.getByText(/uppercase letter/i)).toBeVisible()
        })

        test('shows a validation error when passwords do not match', async ({ page }) => {
            await page.locator('#password').fill('StrongPass1')
            await page.locator('#confirmPassword').fill('StrongPass2')
            await page.getByRole('button', { name: /update password/i }).click()
            await expect(page.getByText(/passwords do not match/i)).toBeVisible()
        })

        test('shows success state after password is updated', async ({ page }) => {
            await page.route(/\/auth\/v1\/user/, (route) => {
                if (route.request().method() === 'PUT') {
                    return route.fulfill({
                        status: 200,
                        contentType: 'application/json',
                        body: JSON.stringify({ user: MOCK_USER }),
                    })
                }
                return route.continue()
            })

            await page.locator('#password').fill('NewPassword1')
            await page.locator('#confirmPassword').fill('NewPassword1')
            await page.getByRole('button', { name: /update password/i }).click()

            await expect(page.getByText(/password updated successfully/i)).toBeVisible()
        })

        test('"Sign in with your new password" link navigates to /login after success', async ({
            page,
        }) => {
            await page.route(/\/auth\/v1\/user/, (route) => {
                if (route.request().method() === 'PUT') {
                    return route.fulfill({
                        status: 200,
                        contentType: 'application/json',
                        body: JSON.stringify({ user: MOCK_USER }),
                    })
                }
                return route.continue()
            })

            await page.locator('#password').fill('NewPassword1')
            await page.locator('#confirmPassword').fill('NewPassword1')
            await page.getByRole('button', { name: /update password/i }).click()
            await page.getByRole('link', { name: /sign in with your new password/i }).click()

            await expect(page).toHaveURL('/login')
        })

        test('shows an error when the password update fails', async ({ page }) => {
            await page.route(/\/auth\/v1\/user/, (route) => {
                if (route.request().method() === 'PUT') {
                    return route.fulfill({
                        status: 422,
                        contentType: 'application/json',
                        body: JSON.stringify({
                            error: 'unprocessable_entity',
                            message: 'Unable to update password.',
                        }),
                    })
                }
                return route.continue()
            })

            await page.locator('#password').fill('NewPassword1')
            await page.locator('#confirmPassword').fill('NewPassword1')
            await page.getByRole('button', { name: /update password/i }).click()

            await expect(
                page.getByRole('alert').getByText(/unable to update password/i),
            ).toBeVisible()
        })
    })
})
