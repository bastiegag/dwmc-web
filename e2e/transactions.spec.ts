import { expect, test } from '@playwright/test'
import { mockAuthenticatedSession } from './auth-fixtures.js'
import { LoginPage } from './pages/login.page.js'

type Transaction = {
    id: string
    type: 'INCOME' | 'EXPENSE' | 'TRANSFER' | 'ADJUSTMENT'
    amount: number
    date: string
    merchant: string | null
    note: string | null
    accountId: string | null
    fromAccountId: string | null
    toAccountId: string | null
    categoryId: string | null
    isArchived: boolean
    createdAt: string
    updatedAt: string
}

type Account = {
    id: string
    name: string
    startingBalance: number
    currentBalance: number
    type: 'CHECKING'
    goal: number | null
    color: string
    icon: string
    isArchived: boolean
    createdAt: string
    updatedAt: string
}

const timestamp = '2026-01-01T00:00:00.000Z'

const createAccount = (id: string, name: string, startingBalance: number): Account => ({
    id,
    name,
    startingBalance,
    currentBalance: startingBalance,
    type: 'CHECKING',
    goal: null,
    color: '#3b82f6',
    icon: 'wallet',
    isArchived: false,
    createdAt: timestamp,
    updatedAt: timestamp,
})

const createTransaction = (id: string, overrides: Partial<Transaction> = {}): Transaction => ({
    id,
    type: 'EXPENSE',
    amount: 25,
    date: '2026-01-15',
    merchant: 'Test transaction',
    note: null,
    accountId: 'checking',
    fromAccountId: null,
    toAccountId: null,
    categoryId: null,
    isArchived: false,
    createdAt: timestamp,
    updatedAt: timestamp,
    ...overrides,
})

const monthOf = (date: string) => date.slice(0, 7)

const setupTransactionApi = async (
    page: Parameters<typeof mockAuthenticatedSession>[0],
    initialTransactions: Transaction[] = [],
) => {
    const accounts = [
        createAccount('checking', 'Checking', 1000),
        createAccount('savings', 'Savings', 500),
    ]
    const transactions = [...initialTransactions]
    let nextId = 1

    const getBalance = (account: Account) => {
        let balance = account.startingBalance
        for (const transaction of transactions) {
            if (transaction.isArchived) continue
            if (transaction.type === 'INCOME' && transaction.accountId === account.id)
                balance += transaction.amount
            if (transaction.type === 'EXPENSE' && transaction.accountId === account.id)
                balance -= transaction.amount
            if (transaction.type === 'ADJUSTMENT' && transaction.accountId === account.id)
                balance += transaction.amount
            if (transaction.type === 'TRANSFER' && transaction.fromAccountId === account.id)
                balance -= transaction.amount
            if (transaction.type === 'TRANSFER' && transaction.toAccountId === account.id)
                balance += transaction.amount
        }
        return balance
    }

    await page.route(/\/api\/v1\/accounts(?:\?.*)?$/, async (route) => {
        const data = accounts.map((account) => ({
            ...account,
            currentBalance: getBalance(account),
        }))
        return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ data }),
        })
    })

    await page.route(/\/api\/v1\/sections(?:\?.*)?$/, (route) =>
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ data: [], nextCursor: null }),
        }),
    )

    await page.route(/\/api\/v1\/budgets(?:\?.*)?$/, (route) =>
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ data: [] }),
        }),
    )

    await page.route(/\/api\/v1\/summary\/monthly(?:\?.*)?$/, (route) =>
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                data: {
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
                },
            }),
        }),
    )

    await page.route(/\/api\/v1\/transactions(?:\?.*)?$/, async (route) => {
        if (route.request().method() === 'POST') {
            const body = (await route.request().postDataJSON()) as Omit<
                Transaction,
                'id' | 'isArchived' | 'createdAt' | 'updatedAt'
            >
            const transaction = createTransaction(`transaction-${nextId++}`, body)
            transactions.push(transaction)
            return route.fulfill({
                status: 201,
                contentType: 'application/json',
                body: JSON.stringify({ data: transaction }),
            })
        }

        const url = new URL(route.request().url())
        const month = url.searchParams.get('month')
        const data = transactions.filter(
            (transaction) =>
                !transaction.isArchived && (!month || monthOf(transaction.date) === month),
        )
        return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                data,
                meta: {
                    page: 1,
                    pageSize: 25,
                    total: data.length,
                    totalPages: data.length ? 1 : 0,
                },
            }),
        })
    })

    await page.route(/\/api\/v1\/transactions\/[^/]+$/, async (route) => {
        const id = route.request().url().split('/').pop() as string
        const transaction = transactions.find((item) => item.id === id)
        if (!transaction) return route.fulfill({ status: 404 })

        if (route.request().method() === 'PATCH') {
            Object.assign(transaction, await route.request().postDataJSON(), {
                updatedAt: timestamp,
            })
        } else if (route.request().method() === 'DELETE') {
            transaction.isArchived = true
        }

        return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ data: transaction }),
        })
    })

    return { accounts, transactions }
}

const login = async (page: Parameters<typeof mockAuthenticatedSession>[0]) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.login('test@example.com', 'Password123')
    await page.waitForURL(/\/dashboard/)
}

test('creates and archives an expense while keeping the account balance synchronized', async ({
    page,
}) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await mockAuthenticatedSession(page)
    await setupTransactionApi(page)
    await login(page)

    await page.goto('/transactions?month=2026-01')
    await page.getByRole('heading', { name: 'Transactions', exact: true }).waitFor()
    await page.getByTestId('primary-action-button').click()
    const dialog = page.getByRole('dialog', { name: 'New Transaction' })
    await dialog.getByLabel('Amount').fill('75')
    await dialog.getByLabel('Account').selectOption('checking')
    await dialog.getByLabel('Merchant (optional)').fill('Coffee shop')
    await dialog.getByRole('button', { name: 'Save' }).click()

    await expect(page.getByText('Coffee shop')).toBeVisible()
    await page.goto('/accounts')
    await expect(page.locator('.text-2xl.font-semibold').filter({ hasText: /925/ })).toBeVisible()

    await page.goto('/transactions?month=2026-01')
    await page.getByRole('button', { name: 'Archive' }).click()
    await expect(page.getByText('Coffee shop')).not.toBeVisible()

    await page.goto('/accounts')
    await expect(
        page.locator('.text-2xl.font-semibold').filter({ hasText: /1,000|1\s*000/ }),
    ).toBeVisible()
})

test('creates a transfer and synchronizes both account balances', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await mockAuthenticatedSession(page)
    await setupTransactionApi(page)
    await login(page)

    await page.goto('/transactions?month=2026-01')
    await page.getByTestId('primary-action-button').click()
    const dialog = page.getByRole('dialog', { name: 'New Transaction' })
    await dialog.getByLabel('Type').selectOption('TRANSFER')
    await dialog.getByLabel('Amount').fill('100')
    await dialog.getByLabel('From account').selectOption('checking')
    await dialog.getByLabel('To account').selectOption('savings')
    await dialog.getByRole('button', { name: 'Save' }).click()

    await expect(page.getByText('TRANSFER', { exact: true })).toBeVisible()
    await page.goto('/accounts')
    await expect(page.locator('.text-2xl.font-semibold').filter({ hasText: /900/ })).toBeVisible()
    await expect(page.locator('.text-2xl.font-semibold').filter({ hasText: /600/ })).toBeVisible()
})

test('moves a transaction from May to June through the edit workflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await mockAuthenticatedSession(page)
    await setupTransactionApi(page, [
        createTransaction('month-transaction', { date: '2026-05-31', merchant: 'May expense' }),
    ])
    await login(page)

    await page.goto('/transactions?month=2026-05')
    await expect(page.getByText('May expense')).toBeVisible()
    await page.getByRole('button', { name: 'Edit' }).click()
    const dialog = page.getByRole('dialog', { name: 'Edit transaction' })
    await dialog.getByLabel('Date').fill('2026-06-01')
    await dialog.getByRole('button', { name: 'Save' }).click()

    await expect(page.getByText('May expense')).not.toBeVisible()
    await page.goto('/transactions?month=2026-06')
    await expect(page.getByText('May expense')).toBeVisible()
})
