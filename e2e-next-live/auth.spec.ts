import { expect, test } from '@playwright/test'

test('authenticates against live Supabase and dwmc-api', async ({ page }) => {
    const email = process.env.E2E_TEST_EMAIL
    const password = process.env.E2E_TEST_PASSWORD
    if (!email || !password) throw new Error('Live test credentials are missing.')

    await page.goto('/login')
    await page.getByLabel('Email').fill(email)
    await page.getByRole('textbox', { name: 'Password' }).fill(password)
    await page.getByRole('button', { name: 'Sign in' }).click()

    await expect(page).toHaveURL(/\/dashboard$/)
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible()
    await page.reload()
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()

    await page.getByRole('button', { name: 'Sign out' }).click()
    await expect(page).toHaveURL(/\/login$/)
})
