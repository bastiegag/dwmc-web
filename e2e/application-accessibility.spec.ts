import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'
import { mockAuthenticatedSession } from './auth-fixtures.js'
import { LoginPage } from './pages/login.page.js'
import type { MonthlySummary } from '../src/features/dashboard/types/summary.types'

const profile = {
    id: 'profile-1',
    authUserId: 'mock-user-id',
    firstName: 'Ada',
    lastName: 'Lovelace',
    displayName: 'Ada',
    preferredCurrency: 'CAD',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
}

const timestamp = '2026-01-15T12:00:00.000Z'
const account = {
    id: 'account-checking',
    name: 'Primary Checking',
    type: 'CHECKING',
    startingBalance: 1000,
    currentBalance: 850,
    goal: null,
    color: '#3b82f6',
    icon: 'wallet',
    isArchived: false,
    createdAt: timestamp,
    updatedAt: timestamp,
}
const category = {
    id: 'category-groceries',
    name: 'Groceries',
    icon: 'shopping-cart',
    sectionId: 'section-needs',
    isArchived: false,
    createdAt: timestamp,
    updatedAt: timestamp,
}
const section = {
    id: 'section-needs',
    name: 'Household Needs',
    color: '#3b82f6',
    isArchived: false,
    categories: [
        category,
        {
            ...category,
            id: 'category-utilities',
            name: 'Utilities',
            icon: 'bolt',
        },
    ],
    createdAt: timestamp,
    updatedAt: timestamp,
}
const transaction = {
    id: 'transaction-groceries',
    type: 'EXPENSE' as const,
    amount: 150,
    date: '2026-01-15',
    merchant: 'Market purchase',
    note: null,
    accountId: account.id,
    fromAccountId: null,
    toAccountId: null,
    categoryId: category.id,
    isArchived: false,
    createdAt: timestamp,
    updatedAt: timestamp,
    account: {
        id: account.id,
        name: account.name,
        color: account.color,
        icon: account.icon,
    },
    category,
}
const populatedSummary: MonthlySummary = {
    month: '2026-01',
    period: {
        startDate: '2026-01-01T00:00:00.000Z',
        endDate: '2026-02-01T00:00:00.000Z',
    },
    totals: {
        incomeTotal: 2000,
        expenseTotal: 150,
        adjustmentTotal: 0,
        transferTotal: 0,
        netTotal: 1850,
        transactionCount: 1,
    },
    topExpenseCategories: [
        {
            categoryId: category.id,
            name: category.name,
            icon: category.icon,
            section: { id: section.id, name: section.name, color: section.color },
            total: 150,
            transactionCount: 1,
            percentage: 100,
        },
    ],
    topIncomeCategories: [],
    accountBreakdown: [
        {
            accountId: account.id,
            name: account.name,
            type: account.type,
            color: account.color,
            icon: account.icon,
            incomeTotal: 0,
            expenseTotal: 150,
            adjustmentTotal: 0,
            transferInTotal: 0,
            transferOutTotal: 0,
            netTotal: -150,
            transactionCount: 1,
        },
    ],
    recentTransactions: [
        {
            id: transaction.id,
            type: transaction.type,
            amount: transaction.amount,
            date: timestamp,
            merchant: transaction.merchant,
            note: null,
            accountId: account.id,
            categoryId: category.id,
            account: transaction.account,
            category: transaction.category,
        },
    ],
}

const expectNoAccessibilityViolations = async (page: Page, state: string) => {
    const { violations } = await new AxeBuilder({ page }).analyze()
    const summary = violations
        .map(
            (violation) =>
                `${violation.id}: ${violation.help}\n${violation.nodes
                    .map(
                        (node) =>
                            `  ${node.target.join(', ')}: ${node.html}\n${node.failureSummary ?? 'No details'}`,
                    )
                    .join('\n')}`,
        )
        .join('\n')

    expect(violations, `${state} has accessibility violations:\n${summary}`).toEqual([])
}

const loginWithPopulatedData = async (page: Page) => {
    await mockAuthenticatedSession(page, populatedSummary)
    await page.route('**/api/v1/profile', (route) =>
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ data: profile }),
        }),
    )
    await page.route(/\/api\/v1\/accounts(?:\?.*)?$/, (route) =>
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ data: [account] }),
        }),
    )
    await page.route(/\/api\/v1\/sections(?:\?.*)?$/, (route) =>
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ data: [section], nextCursor: null }),
        }),
    )
    await page.route(/\/api\/v1\/categories(?:\?.*)?$/, (route) =>
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ data: section.categories, nextCursor: null }),
        }),
    )
    await page.route(/\/api\/v1\/transactions(?:\?.*)?$/, (route) =>
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                data: [transaction],
                meta: { page: 1, pageSize: 25, total: 1, totalPages: 1 },
            }),
        }),
    )
    await page.route(/\/api\/v1\/budgets(?:\?.*)?$/, (route) =>
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                data: [
                    {
                        id: 'budget-groceries',
                        categoryId: category.id,
                        month: '2026-01',
                        amount: 100,
                        spent: 150,
                        remaining: -50,
                        progress: 150,
                        isOverBudget: true,
                        transactionCount: 1,
                        isArchived: false,
                        createdAt: timestamp,
                        updatedAt: timestamp,
                        category: {
                            ...category,
                            section: {
                                id: section.id,
                                name: section.name,
                                color: section.color,
                            },
                        },
                    },
                ],
            }),
        }),
    )

    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.login('test@example.com', 'Password123')
}

test('authenticated application pages have no automated accessibility violations', async ({
    page,
}) => {
    await mockAuthenticatedSession(page)
    await page.route('**/api/v1/profile', (route) =>
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ data: profile }),
        }),
    )

    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.login('test@example.com', 'Password123')

    const pages = [
        { path: '/dashboard?month=2026-01', heading: 'Dashboard' },
        { path: '/transactions?month=2026-01', heading: 'No transactions found' },
        { path: '/budgets?month=2026-01', heading: 'Budgets' },
        { path: '/accounts', heading: 'No accounts yet' },
        { path: '/categories', heading: 'No categories yet' },
        { path: '/tools/profile', heading: 'Profile' },
        { path: '/tools/settings', heading: 'Settings' },
    ]

    for (const { path, heading } of pages) {
        await page.goto(path)
        await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible()

        await expectNoAccessibilityViolations(page, path)
    }
})

test('populated financial pages have no automated accessibility violations', async ({ page }) => {
    await loginWithPopulatedData(page)
    const populatedPages = [
        { path: '/dashboard?month=2026-01', heading: 'Dashboard' },
        { path: '/accounts', heading: 'Accounts' },
        { path: '/transactions?month=2026-01', heading: 'Transactions' },
        { path: '/budgets?month=2026-01', heading: 'Budgets' },
        { path: '/categories', heading: 'Categories' },
    ]

    for (const { path, heading } of populatedPages) {
        await page.goto(path)
        await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible()
        await expectNoAccessibilityViolations(page, path)
    }

    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/budgets?month=2026-01')
    await expect(
        page.getByRole('progressbar', { name: `Budget usage for ${category.name}` }),
    ).toBeVisible()
    const themeToggle = page.getByRole('button', { name: 'Switch to light mode' })
    await themeToggle.click()
    await expect(page.getByRole('button', { name: 'Switch to dark mode' })).toBeVisible()
    await page.getByRole('button', { name: 'Switch to dark mode' }).click()
    await expect(page.locator('html')).toHaveClass(/dark/)
    const activeBudgetLink = page.getByRole('link', { name: 'Budgets' })
    const darkModeLinkColor = await page.evaluate(() => {
        const probe = document.createElement('span')
        probe.className = 'text-primary-border'
        document.body.append(probe)
        const color = getComputedStyle(probe).color
        probe.remove()
        return color
    })
    await expect
        .poll(() => activeBudgetLink.evaluate((element) => getComputedStyle(element).color))
        .toBe(darkModeLinkColor)
    await expectNoAccessibilityViolations(page, 'populated dark-mode budgets')
})

test('account create and validation states have no automated accessibility violations', async ({
    page,
}) => {
    await loginWithPopulatedData(page)
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/accounts')
    await page.getByTestId('primary-action-button').click()
    const createAccountDialog = page.getByRole('dialog', { name: 'Create account' })
    await expect(createAccountDialog).toBeVisible()
    await expect(createAccountDialog).toHaveCSS('opacity', '1')
    await expectNoAccessibilityViolations(page, 'account create dialog')

    await createAccountDialog.getByRole('button', { name: 'Create account' }).click()
    await expect(createAccountDialog.getByRole('alert')).toContainText('Account name is required')
    await expectNoAccessibilityViolations(page, 'account form validation errors')
    await page.keyboard.press('Escape')
    await expect(createAccountDialog).not.toBeVisible()
})

test('category archive confirmation has no automated accessibility violations', async ({
    page,
}) => {
    await loginWithPopulatedData(page)
    await page.goto('/categories')
    await page.getByRole('button', { name: `Archive category ${category.name}` }).click()
    const archiveDialog = page.getByRole('alertdialog')
    await expect(archiveDialog).toBeVisible()
    await expect(archiveDialog).toHaveCSS('opacity', '1')
    await expectNoAccessibilityViolations(page, 'category archive confirmation')
})
