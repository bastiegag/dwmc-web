import { expect, test } from '@playwright/test'
import { mockAuthenticatedSession } from './auth-fixtures.js'
import { LoginPage } from './pages/login.page.js'

const dashboardSummary = {
    month: '2026-06',
    period: { startDate: '2026-06-01T00:00:00.000Z', endDate: '2026-07-01T00:00:00.000Z' },
    totals: {
        incomeTotal: 1250,
        expenseTotal: 325.5,
        adjustmentTotal: 0,
        transferTotal: 100,
        netTotal: 924.5,
        transactionCount: 4,
    },
    topExpenseCategories: [
        {
            categoryId: 'category-groceries',
            name: 'Groceries',
            icon: 'shopping-bag',
            section: { id: 'section-needs', name: 'Needs', color: '#3b82f6' },
            total: 325.5,
            transactionCount: 3,
            percentage: 100,
        },
    ],
    topIncomeCategories: [],
    accountBreakdown: [],
    recentTransactions: [
        {
            id: 'transaction-groceries',
            type: 'EXPENSE' as const,
            amount: 45.5,
            date: '2026-06-30T12:00:00.000Z',
            merchant: 'Market purchase',
            note: null,
            accountId: 'account-checking',
            categoryId: 'category-groceries',
            account: null,
            category: null,
        },
    ],
}

test('renders the selected month summary with financial totals and recent activity', async ({
    page,
}) => {
    await mockAuthenticatedSession(page, dashboardSummary)

    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.login('test@example.com', 'Password123')

    await page.goto('/dashboard?month=2026-06')
    await expect(page).toHaveURL('/dashboard?month=2026-06')
    await expect(page.getByRole('status')).toHaveText(/juin 2026/i)

    await expect(page.getByRole('heading', { name: 'Income', level: 2 })).toBeVisible()
    await expect(page.getByText(/1.*250,00/)).toBeVisible()
    const expensesCard = page
        .getByRole('heading', { name: 'Expenses', level: 2 })
        .locator('..')
        .locator('..')
        .locator('..')
    await expect(expensesCard).toBeVisible()
    await expect(expensesCard.getByText(/325,50/)).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Net', level: 2 })).toBeVisible()
    await expect(page.getByText(/924,50/)).toBeVisible()
    await expect(page.getByText('Groceries')).toBeVisible()
    await expect(page.getByText('Market purchase')).toBeVisible()
})
