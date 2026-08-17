import { expect, test } from '@playwright/test'
import { mockAuthenticatedSession } from './auth-fixtures.js'
import { LoginPage } from './pages/login.page.js'

test('authenticated users can create an account and record an expense', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await mockAuthenticatedSession(page)

    let account: {
        id: string
        name: string
        type: 'CHECKING'
        startingBalance: number
        currentBalance: number
        goal: number | null
        color: string
        icon: string
        isArchived: boolean
        createdAt: string
        updatedAt: string
    } | null = null
    let expenseAmount = 0

    await page.route(/\/api\/v1\/accounts(?:\?.*)?$/, async (route) => {
        if (route.request().method() === 'POST') {
            const body = (await route.request().postDataJSON()) as {
                name: string
                type?: 'CHECKING'
                startingBalance?: number
                goal?: number | null
                color: string
                icon: string
            }
            const now = '2026-01-01T00:00:00.000Z'
            account = {
                id: 'account-1',
                name: body.name,
                type: body.type ?? 'CHECKING',
                startingBalance: body.startingBalance ?? 0,
                currentBalance: body.startingBalance ?? 0,
                goal: body.goal ?? null,
                color: body.color,
                icon: body.icon,
                isArchived: false,
                createdAt: now,
                updatedAt: now,
            }
            return route.fulfill({
                status: 201,
                contentType: 'application/json',
                body: JSON.stringify({ data: account }),
            })
        }

        const current = account
            ? { ...account, currentBalance: account.startingBalance - expenseAmount }
            : null
        return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ data: current ? [current] : [] }),
        })
    })

    await page.route(/\/api\/v1\/transactions(?:\?.*)?$/, async (route) => {
        if (route.request().method() === 'POST') {
            const body = (await route.request().postDataJSON()) as {
                type: string
                amount: number
                accountId: string
            }
            expenseAmount = body.type === 'EXPENSE' ? body.amount : 0
            return route.fulfill({
                status: 201,
                contentType: 'application/json',
                body: JSON.stringify({
                    data: {
                        id: 'transaction-1',
                        ...body,
                        date: '2026-01-01',
                        merchant: null,
                        note: null,
                        fromAccountId: null,
                        toAccountId: null,
                        categoryId: null,
                        isArchived: false,
                        createdAt: '2026-01-01T00:00:00.000Z',
                        updatedAt: '2026-01-01T00:00:00.000Z',
                    },
                }),
            })
        }

        return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                data: [],
                meta: { page: 1, pageSize: 20, total: 0, totalPages: 0 },
            }),
        })
    })

    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.login('test@example.com', 'Password123')

    await page.goto('/accounts')
    await expect(page.getByRole('heading', { name: 'Accounts', exact: true })).toBeVisible()
    await page.getByTestId('primary-action-button').click()
    await page.getByLabel('Account name').fill('Daily Checking')
    await page.getByLabel(/Starting balance/i).fill('1250')
    await page.getByRole('button', { name: 'Create account' }).click()

    await expect(page.getByText('Daily Checking')).toBeVisible()
    await expect(
        page
            .locator('.text-2xl.font-semibold')
            .filter({ hasText: /1,250\.00|1\s*250,00|1\s*250\.00/ }),
    ).toBeVisible()

    await page.goto('/transactions')
    await expect(page.getByRole('heading', { name: 'Transactions', exact: true })).toBeVisible()
    await page.getByTestId('primary-action-button').click()
    const transactionDialog = page.getByRole('dialog', { name: 'New Transaction' })
    await page.getByLabel('Amount').fill('75')
    await transactionDialog.getByLabel('Account').selectOption('account-1')
    await transactionDialog.getByLabel('Merchant (optional)').fill('Coffee shop')
    await transactionDialog.getByRole('button', { name: 'Save' }).click()

    await page.goto('/accounts')
    await expect(
        page
            .locator('.text-2xl.font-semibold')
            .filter({ hasText: /1,175\.00|1\s*175,00|1\s*175\.00/ }),
    ).toBeVisible()
})
