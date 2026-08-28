import { expect, test } from '@playwright/test'
import { mockAuthenticatedSession } from './auth-fixtures.js'
import { LoginPage } from './pages/login.page.js'

const emptySummary = {
    month: '2026-01',
    period: { startDate: '2026-01-01', endDate: '2026-01-31' },
    totals: {
        incomeTotal: 0,
        expenseTotal: 0,
        adjustmentTotal: 0,
        transferTotal: 0,
        netTotal: 0,
        transactionCount: 0,
    },
    topExpenseCategories: [],
    topIncomeCategories: [],
    accountBreakdown: [],
    recentTransactions: [],
}

const login = async (page: Parameters<typeof mockAuthenticatedSession>[0]) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.login('test@example.com', 'Password123')
}

test('a new user can understand the empty application and reach core sections', async ({
    page,
}) => {
    await mockAuthenticatedSession(page, emptySummary)
    await login(page)

    await expect(page.getByRole('heading', { name: 'No activity this month' })).toBeVisible()

    await page.getByRole('link', { name: 'Transactions' }).click()
    await expect(page.getByRole('heading', { name: 'No transactions found' })).toBeVisible()

    await page.getByRole('link', { name: 'Accounts' }).click()
    await expect(page.getByRole('heading', { name: 'No accounts yet' })).toBeVisible()

    await page.getByRole('link', { name: 'Tools' }).click()
    await page.getByRole('link', { name: 'Categories' }).click()
    await expect(page.getByRole('heading', { name: 'No categories yet' })).toBeVisible()

    await page.getByRole('link', { name: 'Tools' }).click()
    await page.getByRole('link', { name: 'Settings' }).click()
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()
})
