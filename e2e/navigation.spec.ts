import { test, expect } from '@playwright/test'

test('/ redirects to /login', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL('/login')
})

test('unknown path redirects to /login', async ({ page }) => {
    await page.goto('/unknown-path')
    await expect(page).toHaveURL('/login')
})

test('/app redirects to /login when not authenticated', async ({ page }) => {
    await page.goto('/app')
    await expect(page).toHaveURL('/login')
})
