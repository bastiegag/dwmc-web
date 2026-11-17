import { expect, test, type Page } from '@playwright/test'
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
    account?: {
        id: string
        name: string
        color: string
        icon: string
    } | null
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
    options: {
        failCreate?: boolean
        failArchive?: boolean
        archivePending?: Promise<void>
        onArchiveRequest?: () => void
        checkingAccountName?: string
    } = {},
) => {
    const accounts = [
        createAccount('checking', options.checkingAccountName ?? 'Checking', 1000),
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

    await page.route(/\/api\/v1\/summary\/monthly(?:\?.*)?$/, (route) => {
        const url = new URL(route.request().url())
        const month = url.searchParams.get('month') ?? '2026-01'
        const [year, monthNumber] = month.split('-').map(Number)
        const monthTransactions = transactions.filter(
            (transaction) => !transaction.isArchived && monthOf(transaction.date) === month,
        )
        const total = (type: Transaction['type']) =>
            monthTransactions
                .filter((transaction) => transaction.type === type)
                .reduce((sum, transaction) => sum + transaction.amount, 0)
        const recentTransactions = monthTransactions.slice(0, 5).map((transaction) => {
            const account = accounts.find(({ id }) => id === transaction.accountId)
            return account
                ? {
                      ...transaction,
                      account: {
                          id: account.id,
                          name: account.name,
                          color: account.color,
                          icon: account.icon,
                      },
                  }
                : transaction
        })
        return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                data: {
                    month,
                    period: {
                        startDate: `${month}-01`,
                        endDate: new Date(Date.UTC(year, monthNumber, 0))
                            .toISOString()
                            .slice(0, 10),
                    },
                    totals: {
                        incomeTotal: total('INCOME'),
                        expenseTotal: total('EXPENSE'),
                        adjustmentTotal: total('ADJUSTMENT'),
                        transferTotal: total('TRANSFER'),
                        netTotal: total('INCOME') - total('EXPENSE') + total('ADJUSTMENT'),
                        transactionCount: monthTransactions.length,
                    },
                    topExpenseCategories: [],
                    topIncomeCategories: [],
                    accountBreakdown: [],
                    recentTransactions,
                },
            }),
        })
    })

    await page.route(/\/api\/v1\/transactions(?:\?.*)?$/, async (route) => {
        if (route.request().method() === 'POST') {
            if (options.failCreate) {
                return route.fulfill({
                    status: 500,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        error: {
                            code: 'INTERNAL_ERROR',
                            message: 'Unable to save transaction',
                        },
                    }),
                })
            }
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
        const data = transactions
            .filter(
                (transaction) =>
                    !transaction.isArchived && (!month || monthOf(transaction.date) === month),
            )
            .map((transaction) => {
                const account = accounts.find(({ id }) => id === transaction.accountId)
                return account
                    ? {
                          ...transaction,
                          account: {
                              id: account.id,
                              name: account.name,
                              color: account.color,
                              icon: account.icon,
                          },
                      }
                    : transaction
            })
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
            options.onArchiveRequest?.()
            if (options.failArchive) {
                return route.fulfill({
                    status: 500,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        error: {
                            code: 'INTERNAL_ERROR',
                            message: 'Unable to archive transaction',
                        },
                    }),
                })
            }
            if (options.archivePending) await options.archivePending
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

const chooseOption = async (page: Page, label: string, option: string) => {
    await page.getByRole('combobox', { name: label }).click()
    await page.getByRole('option', { name: option, exact: true }).click()
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
    await chooseOption(page, 'Account', 'Checking')
    await dialog.getByLabel('Merchant (optional)').fill('Coffee shop')
    await dialog.getByRole('button', { name: 'Save' }).click()

    await expect(page.getByText('Coffee shop')).toBeVisible()
    await page.goto('/dashboard?month=2026-01')
    await expect(page.getByText('Coffee shop')).toBeVisible()

    await page.goto('/accounts')
    await expect(page.locator('.text-2xl.font-semibold').filter({ hasText: /925/ })).toBeVisible()

    await page.goto('/transactions?month=2026-01')
    await page.getByRole('button', { name: 'Archive' }).click()
    await page.getByRole('alertdialog').getByRole('button', { name: 'Archive' }).click()
    await expect(page.getByText('Coffee shop')).not.toBeVisible()

    await page.goto('/dashboard?month=2026-01')
    await expect(page.getByText('Coffee shop')).not.toBeVisible()

    await page.goto('/accounts')
    await expect(
        page.locator('.text-2xl.font-semibold').filter({ hasText: /1,000|1\s*000/ }),
    ).toBeVisible()
})

test('shows validation feedback and keeps the transaction form usable', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await mockAuthenticatedSession(page)
    await setupTransactionApi(page)
    await login(page)

    await page.goto('/transactions?month=2026-01')
    await expect(page.getByRole('heading', { name: 'Transactions', exact: true })).toBeVisible()
    await page.getByTestId('primary-action-button').click()
    const dialog = page.getByRole('dialog', { name: 'New Transaction' })
    await dialog.getByRole('button', { name: 'Save' }).click()

    await expect(dialog.getByText('Amount must be greater than 0')).toBeVisible()
    await expect(dialog).toBeVisible()
})

test('shows an understandable API error without closing the transaction form', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await mockAuthenticatedSession(page)
    await setupTransactionApi(page, [], { failCreate: true })
    await login(page)

    await page.goto('/transactions?month=2026-01')
    await expect(page.getByRole('heading', { name: 'Transactions', exact: true })).toBeVisible()
    await page.getByTestId('primary-action-button').click()
    const dialog = page.getByRole('dialog', { name: 'New Transaction' })
    await dialog.getByLabel('Amount').fill('25')
    await chooseOption(page, 'Account', 'Checking')
    await dialog.getByLabel('Merchant (optional)').fill('Preserved purchase')
    await dialog.getByRole('button', { name: 'Save' }).click()

    await expect(dialog.getByRole('alert')).toBeVisible()
    await expect(dialog.getByRole('alert')).toContainText(/unable to save transaction/i)
    await expect(dialog).toBeVisible()
    await expect(dialog.getByLabel('Amount')).toHaveValue(/25/)
    await expect(dialog.getByLabel('Merchant (optional)')).toHaveValue('Preserved purchase')
    await expect(dialog.getByRole('combobox', { name: 'Account' })).toContainText(/checking/i)
})

test('keeps the archive confirmation open and reports archive failures', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await mockAuthenticatedSession(page)
    await setupTransactionApi(page, [createTransaction('transaction-1')], { failArchive: true })
    await login(page)

    await page.goto('/transactions?month=2026-01')
    const archiveButton = page.getByRole('button', { name: 'Archive' })
    await archiveButton.click()

    const confirmation = page.getByRole('alertdialog')
    const confirmButton = confirmation.getByRole('button', { name: 'Archive' })
    await confirmButton.click()

    await expect(confirmation).toBeVisible()
    await expect(page.getByRole('alert')).toContainText('Unable to archive transaction')
    await expect(confirmButton).toBeEnabled()
})

test('keeps archive confirmation pending and prevents duplicate confirmation', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await mockAuthenticatedSession(page)
    let archiveRequestCount = 0
    let releaseArchive!: () => void
    const archivePending = new Promise<void>((resolve) => {
        releaseArchive = resolve
    })
    await setupTransactionApi(page, [createTransaction('transaction-1')], {
        archivePending,
        onArchiveRequest: () => {
            archiveRequestCount += 1
        },
    })
    await login(page)

    await page.goto('/transactions?month=2026-01')
    await page.getByRole('button', { name: 'Archive' }).click()
    const confirmation = page.getByRole('alertdialog')
    const confirmButton = confirmation.getByRole('button', { name: 'Archive' })
    await confirmButton.click()

    const pendingButton = confirmation.getByRole('button', { name: 'Archiving...' })
    await expect(pendingButton).toBeDisabled()
    await expect(confirmation.getByRole('button', { name: 'Cancel' })).toBeDisabled()
    await page.keyboard.press('Escape')
    await expect(confirmation).toBeVisible()
    await page.mouse.click(5, 5)
    await expect(confirmation).toBeVisible()
    await expect(confirmation).toHaveCSS('opacity', '1')
    await expect(pendingButton.click({ timeout: 1000 })).rejects.toThrow()
    await expect.poll(() => archiveRequestCount).toBe(1)

    releaseArchive()
    await expect(confirmation).not.toBeVisible()
    expect(archiveRequestCount).toBe(1)
})

test('creates a transfer and synchronizes both account balances', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await mockAuthenticatedSession(page)
    await setupTransactionApi(page)
    await login(page)

    await page.goto('/transactions?month=2026-01')
    await page.getByTestId('primary-action-button').click()
    const dialog = page.getByRole('dialog', { name: 'New Transaction' })
    await chooseOption(page, 'Type', 'Transfer')
    await dialog.getByLabel('Amount').fill('100')
    await chooseOption(page, 'From account', 'Checking')
    await chooseOption(page, 'To account', 'Savings')
    await dialog.getByRole('button', { name: 'Save' }).click()

    await expect(
        page.getByRole('list', { name: 'Transactions' }).getByText('TRANSFER', { exact: true }),
    ).toBeVisible()
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
    await dialog.getByLabel(/Date/).fill('2026-06-01')
    await dialog.getByRole('button', { name: 'Save' }).click()

    await expect(page.getByText('May expense')).not.toBeVisible()
    await page.goto('/transactions?month=2026-06')
    await expect(page.getByText('May expense')).toBeVisible()
})

test('keeps long transaction content and the dialog within supported viewports', async ({
    page,
}) => {
    const longMerchant = 'MerchantName'.repeat(10)
    await mockAuthenticatedSession(page)
    await setupTransactionApi(page, [createTransaction('long-label', { merchant: longMerchant })], {
        checkingAccountName: 'Household chequing account for everyday and recurring expenses',
    })
    await login(page)

    await page.goto('/transactions?month=2026-01')
    await expect(page.getByText(longMerchant)).toBeVisible()

    for (const width of [320, 430, 768, 1280]) {
        await page.setViewportSize({ width, height: 844 })
        await expect
            .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
            .toBeLessThanOrEqual(width)

        const transactionList = page.getByRole('list', { name: 'Transactions' })
        const itemBox = await transactionList.getByRole('listitem').first().boundingBox()
        expect(itemBox).not.toBeNull()
        expect(itemBox?.width).toBeLessThanOrEqual(width)

        await page.getByRole('button', { name: 'Add transaction' }).click()
        const dialog = page.getByRole('dialog', { name: 'New Transaction' })
        const dialogBox = await dialog.boundingBox()
        expect(dialogBox).not.toBeNull()
        expect(dialogBox?.x).toBeGreaterThanOrEqual(0)
        expect((dialogBox?.x ?? 0) + (dialogBox?.width ?? 0)).toBeLessThanOrEqual(width)
        await dialog.getByRole('button', { name: 'Close transaction dialog' }).click()
    }
})
