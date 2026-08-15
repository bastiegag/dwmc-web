import { test, expect } from '@playwright/test'
import { LoginPage } from './pages/login.page.js'
import { mockAuthenticatedSession } from './auth-fixtures.js'

test.describe('Logout', () => {
    test('removes protected UI and prevents access after signing out', async ({ page }) => {
        await mockAuthenticatedSession(page)

        const loginPage = new LoginPage(page)
        await loginPage.goto()
        await loginPage.login('test@example.com', 'Password123')
        await expect(page).toHaveURL('/dashboard')
        await expect(page.getByRole('heading', { name: 'Income' })).toBeVisible()

        await page.getByRole('button', { name: /sign out/i }).click()
        await expect(page).toHaveURL('/login')
        await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible()

        await page.goto('/dashboard')
        await expect(page).toHaveURL('/login')
        await expect(page.getByText(/total income/i)).not.toBeVisible()
    })

    test('does not show a previous user summary after a new session starts', async ({ page }) => {
        let summary = {
            month: '2026-01',
            period: {
                startDate: '2026-01-01T00:00:00.000Z',
                endDate: '2026-02-01T00:00:00.000Z',
            },
            totals: {
                incomeTotal: 1000,
                expenseTotal: 250,
                adjustmentTotal: 0,
                transferTotal: 0,
                netTotal: 750,
                transactionCount: 1,
            },
            topExpenseCategories: [],
            topIncomeCategories: [],
            accountBreakdown: [],
            recentTransactions: [],
        }
        await mockAuthenticatedSession(page, summary)
        await page.route(/\/api\/v1\/summary\/monthly(?:\?.*)?$/, (route) =>
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ data: summary }),
            }),
        )

        const loginPage = new LoginPage(page)
        await loginPage.goto()
        await loginPage.login('test@example.com', 'Password123')
        await expect(page).toHaveURL('/dashboard')
        await expect(page.getByRole('heading', { name: 'Income' })).toBeVisible()

        await page.getByRole('button', { name: /sign out/i }).click()
        await expect(page).toHaveURL('/login')

        summary = { ...summary, totals: { ...summary.totals, incomeTotal: 25 } }
        await loginPage.login('test@example.com', 'Password123')
        await expect(page).toHaveURL('/dashboard')
        const incomeCard = page
            .getByRole('heading', { name: 'Income' })
            .locator('..')
            .locator('..')
            .locator('..')
        await expect(incomeCard.locator('.text-2xl')).toHaveText(/25/)
        await expect(incomeCard.locator('.text-2xl')).not.toHaveText(/1.?000/)
    })
})
