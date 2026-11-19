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
            section: { id: 'section-needs', name: 'Needs', color: 'primary' },
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
    await expect(page.locator('span[role="status"]').filter({ hasText: 'juin 2026' })).toBeVisible()

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

test('preserves a deep-linked month across month-aware navigation', async ({ page }) => {
    await mockAuthenticatedSession(page)
    await page.route(/\/api\/v1\/transactions(?:\?.*)?$/, (route) =>
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                data: [],
                meta: { page: 1, pageSize: 20, total: 0, totalPages: 0 },
            }),
        }),
    )

    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.login('test@example.com', 'Password123')
    await expect(page).toHaveURL('/dashboard')

    await page.goto('/dashboard?month=2026-05')

    await expect(page).toHaveURL('/dashboard?month=2026-05')
    await expect(page.locator('span[role="status"]').filter({ hasText: 'mai 2026' })).toBeVisible()

    await page.getByTestId('desktop-sidebar').getByRole('link', { name: 'Transactions' }).click()
    await expect(page).toHaveURL('/transactions?month=2026-05')
    await expect(page.locator('span[role="status"]').filter({ hasText: 'mai 2026' })).toBeVisible()

    await page.getByTestId('desktop-sidebar').getByRole('link', { name: 'Budgets' }).click()
    await expect(page).toHaveURL('/budgets?month=2026-05')
    await expect(page.locator('span[role="status"]').filter({ hasText: 'mai 2026' })).toBeVisible()

    await page.getByTestId('desktop-sidebar').getByRole('link', { name: 'Overview' }).click()
    await expect(page).toHaveURL('/dashboard?month=2026-05')
    await expect(page.locator('span[role="status"]').filter({ hasText: 'mai 2026' })).toBeVisible()
})

test('keeps long financial labels and values within responsive dashboard layouts', async ({
    page,
}) => {
    const responsiveSummary = {
        ...dashboardSummary,
        totals: {
            ...dashboardSummary.totals,
            incomeTotal: 0,
            expenseTotal: 123456789.99,
            netTotal: -123456789.99,
        },
        topExpenseCategories: [
            {
                ...dashboardSummary.topExpenseCategories[0],
                name: 'Household essentials and recurring home maintenance expenses',
                total: 123456789.99,
            },
        ],
        accountBreakdown: [
            {
                accountId: 'account-long-name',
                name: 'Primary household chequing account for everyday expenses',
                type: 'CHECKING',
                color: 'destructive',
                icon: 'wallet',
                incomeTotal: 0,
                expenseTotal: 123456789.99,
                adjustmentTotal: 0,
                transferInTotal: 0,
                transferOutTotal: 0,
                netTotal: -123456789.99,
                transactionCount: 123456,
            },
        ],
        recentTransactions: [
            {
                ...dashboardSummary.recentTransactions[0],
                amount: 123456789.99,
                merchant:
                    'A very long merchant name used to verify responsive transaction descriptions',
            },
        ],
    }

    await mockAuthenticatedSession(page, responsiveSummary)
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.login('test@example.com', 'Password123')
    await page.goto('/dashboard?month=2026-06')

    await expect(
        page.getByText('Household essentials and recurring home maintenance expenses'),
    ).toBeVisible()
    await expect(
        page.getByText('Primary household chequing account for everyday expenses'),
    ).toBeVisible()

    for (const width of [320, 430, 768, 1280]) {
        await page.setViewportSize({ width, height: 800 })
        expect(
            await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
        ).toBe(true)

        if (width < 1024) {
            await expect(page.getByTestId('mobile-bottom-nav')).toBeVisible()
        } else {
            await expect(page.getByTestId('mobile-bottom-nav')).toBeHidden()
        }
    }

    await page.setViewportSize({ width: 320, height: 640 })
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
    const viewAllLink = page.getByRole('link', { name: /view all transactions/i })
    const navigation = page.getByTestId('mobile-bottom-nav')
    const linkBox = await viewAllLink.boundingBox()
    const navigationBox = await navigation.boundingBox()

    expect(linkBox).not.toBeNull()
    expect(navigationBox).not.toBeNull()
    if (linkBox && navigationBox) {
        expect(linkBox.y + linkBox.height).toBeLessThanOrEqual(navigationBox.y)
    }
})
