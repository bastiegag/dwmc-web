import { expect, test, type Page } from '@playwright/test'

test.describe.configure({ mode: 'serial' })

const login = async (page: Page) => {
    await page.goto('/login')
    await page.getByLabel('Email').fill('alice@example.com')
    await page.getByRole('textbox', { name: 'Password' }).fill('Password1')
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page).toHaveURL(/\/protected-proof$/)
}

test.describe('Next.js feature parity', () => {
    test('loads the dashboard, navigates months, and preserves month-aware links', async ({
        page,
    }) => {
        await login(page)
        await page.goto('/dashboard?month=2026-06')

        await expect(page.getByRole('heading', { name: 'No activity this month' })).toBeVisible()
        await expect(page.locator('span[role="status"]')).toContainText('juin 2026')

        await page.getByRole('button', { name: 'Go to previous month' }).click()
        await expect(page).toHaveURL('/dashboard?month=2026-05')
        await expect(page.locator('span[role="status"]')).toContainText('mai 2026')

        await page
            .getByRole('navigation', { name: 'Primary navigation' })
            .getByRole('link', { name: 'Transactions' })
            .click()
        await expect(page).toHaveURL('/transactions?month=2026-05')
        await page
            .getByRole('navigation', { name: 'Primary navigation' })
            .getByRole('link', { name: 'Budgets' })
            .click()
        await expect(page).toHaveURL('/budgets?month=2026-05')
    })

    test('supports account, category, transaction, and budget workflows', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 })
        await login(page)

        await page.goto('/accounts')
        await page.getByTestId('primary-action-button').click()
        await page.getByLabel('Account name').fill('Daily Checking')
        await page.getByLabel(/Starting balance/i).fill('1250')
        await page.getByRole('button', { name: 'Create account' }).click()
        await expect(page.getByText('Daily Checking')).toBeVisible()

        await page.goto('/categories')
        await page.getByTestId('primary-action-button').click()
        await page.getByLabel('Section name').fill('Food')
        await page.getByRole('button', { name: 'Create section' }).click()
        await expect(page.getByText('Food')).toBeVisible()
        await page.getByTestId('primary-action-button').click()
        await page.getByLabel('Category name').fill('Groceries')
        await page.getByLabel('Icon').fill('shopping-cart')
        await page.getByLabel('Section', { exact: true }).selectOption('section-1')
        await page.getByRole('button', { name: 'Create category' }).click()
        await expect(page.getByText('Groceries')).toBeVisible()

        await page.goto('/transactions?month=2026-06')
        await page.getByTestId('primary-action-button').click()
        const transactionDialog = page.getByRole('dialog', { name: 'New Transaction' })
        await transactionDialog.getByLabel('Amount').fill('75')
        await transactionDialog.getByLabel('Account').selectOption('account-1')
        await transactionDialog.getByLabel('Category (optional)').selectOption('category-1')
        await transactionDialog.getByLabel('Merchant (optional)').fill('Coffee shop')
        await transactionDialog.getByRole('button', { name: 'Save' }).click()
        await expect(page.getByText('Coffee shop')).toBeVisible()

        await page.goto('/budgets?month=2026-06')
        await page.getByTestId('primary-action-button').click()
        const budgetDialog = page.getByRole('dialog', { name: 'New Budget' })
        await budgetDialog.getByLabel('Category').selectOption('category-1')
        await budgetDialog.getByLabel('Month').fill('2026-06')
        await budgetDialog.getByLabel('Amount').fill('300')
        await budgetDialog.getByRole('button', { name: 'Create budget' }).click()
        await expect(
            page.locator('.text-2xl.font-semibold').filter({ hasText: '300' }).first(),
        ).toBeVisible()
    })

    test('keeps tools, mobile navigation, and dialog keyboard behavior accessible', async ({
        page,
    }) => {
        await page.setViewportSize({ width: 390, height: 844 })
        await login(page)
        await page.goto('/tools')

        await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible()
        await page.getByRole('link', { name: 'Profile' }).click()
        await expect(page).toHaveURL(/\/tools\/profile\?month=/)
        await expect(page.getByRole('heading', { name: 'Profile' })).toBeVisible()

        await page.getByRole('link', { name: 'Tools' }).click()
        await page.getByRole('link', { name: 'Settings' }).click()
        await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()

        await page.goto('/accounts')
        await page.getByTestId('primary-action-button').click()
        const dialog = page.getByRole('dialog', { name: 'Create account' })
        await expect(dialog).toBeVisible()
        await page.keyboard.press('Escape')
        await expect(dialog).not.toBeVisible()
    })
})
