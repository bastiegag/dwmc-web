import { expect, test, type Page, type Route } from '@playwright/test'
import { mockAuthenticatedSession } from './auth-fixtures.js'
import { LoginPage } from './pages/login.page.js'

type Category = {
    id: string
    name: string
    icon: string
    sectionId: string
    isArchived: boolean
    createdAt: string
    updatedAt: string
}

type Section = {
    id: string
    name: string
    color: string
    isArchived: boolean
    categories: Category[]
    createdAt: string
    updatedAt: string
}

type Budget = {
    id: string
    categoryId: string
    month: string
    amount: number
    isArchived: boolean
    createdAt: string
    updatedAt: string
}

type Transaction = {
    id: string
    type: 'EXPENSE'
    amount: number
    date: string
    merchant: string | null
    note: string | null
    accountId: string
    fromAccountId: null
    toAccountId: null
    categoryId: string
    isArchived: boolean
    createdAt: string
    updatedAt: string
}

const timestamp = '2026-06-01T00:00:00.000Z'
const budgetMonth = '2026-06'

const createBudget = (id: string, categoryId: string, amount: number): Budget => ({
    id,
    categoryId,
    month: budgetMonth,
    amount,
    isArchived: false,
    createdAt: timestamp,
    updatedAt: timestamp,
})

const createTransaction = (
    id: string,
    categoryId: string,
    overrides: Partial<Transaction> = {},
): Transaction => ({
    id,
    type: 'EXPENSE',
    amount: 25,
    date: '2026-06-15',
    merchant: 'Market purchase',
    note: null,
    accountId: 'checking',
    fromAccountId: null,
    toAccountId: null,
    categoryId,
    isArchived: false,
    createdAt: timestamp,
    updatedAt: timestamp,
    ...overrides,
})

const monthOf = (date: string) => date.slice(0, 7)

const setupBudgetApi = async (page: Parameters<typeof mockAuthenticatedSession>[0]) => {
    const section: Section = {
        id: 'section-food',
        name: 'Food',
        color: 'success',
        isArchived: false,
        categories: [],
        createdAt: timestamp,
        updatedAt: timestamp,
    }
    const sections = [section]
    const budgets: Budget[] = []
    const transactions: Transaction[] = []
    let nextTransactionId = 1

    const fulfill = (route: Route, data: unknown, status = 200) =>
        route.fulfill({
            status,
            contentType: 'application/json',
            body: JSON.stringify({ data }),
        })

    await page.route(/\/api\/v1\/sections(?:\?.*)?$/, async (route) => {
        const method = route.request().method()
        if (method === 'GET') {
            return fulfill(route, sections, 200).then(() => undefined)
        }
        if (method === 'POST') {
            const body = (await route.request().postDataJSON()) as {
                name: string
                color: string
            }
            section.name = body.name
            section.color = body.color
            return fulfill(route, section, 201).then(() => undefined)
        }
        return fulfill(route, section)
    })

    await page.route(/\/api\/v1\/categories(?:\?.*)?$/, async (route) => {
        if (route.request().method() === 'POST') {
            const body = (await route.request().postDataJSON()) as {
                name: string
                icon: string
                sectionId: string
            }
            const category: Category = {
                id: 'category-groceries',
                name: body.name,
                icon: body.icon,
                sectionId: body.sectionId,
                isArchived: false,
                createdAt: timestamp,
                updatedAt: timestamp,
            }
            section.categories = [category]
            return fulfill(route, category, 201).then(() => undefined)
        }
        return fulfill(route, section.categories).then(() => undefined)
    })

    await page.route(/\/api\/v1\/accounts(?:\?.*)?$/, (route) =>
        fulfill(route, [
            {
                id: 'checking',
                name: 'Checking',
                type: 'CHECKING',
                startingBalance: 1000,
                currentBalance: 1000,
                goal: null,
                color: 'primary',
                icon: 'wallet',
                isArchived: false,
                createdAt: timestamp,
                updatedAt: timestamp,
            },
        ]).then(() => undefined),
    )

    await page.route(/\/api\/v1\/budgets(?:\?.*)?$/, async (route) => {
        if (route.request().method() === 'POST') {
            const body = (await route.request().postDataJSON()) as {
                categoryId: string
                month: string
                amount: number
            }
            const budget = createBudget('budget-groceries', body.categoryId, body.amount)
            budgets.push({ ...budget, month: body.month })
            return fulfill(route, buildBudgetResponse(budget, sections, transactions), 201).then(
                () => undefined,
            )
        }

        const url = new URL(route.request().url())
        const month = url.searchParams.get('month')
        const data = budgets
            .filter((budget) => !budget.isArchived && (!month || budget.month === month))
            .map((budget) => buildBudgetResponse(budget, sections, transactions))
        return fulfill(route, data).then(() => undefined)
    })

    await page.route(/\/api\/v1\/budgets\/[^/]+$/, async (route) => {
        const id = route.request().url().split('/').pop() as string
        const budget = budgets.find((item) => item.id === id)
        if (!budget) return route.fulfill({ status: 404 })

        if (route.request().method() === 'PATCH') {
            Object.assign(budget, await route.request().postDataJSON(), {
                updatedAt: timestamp,
            })
        } else if (route.request().method() === 'DELETE') {
            budget.isArchived = true
        }

        return fulfill(route, buildBudgetResponse(budget, sections, transactions)).then(
            () => undefined,
        )
    })

    await page.route(/\/api\/v1\/transactions(?:\?.*)?$/, async (route) => {
        if (route.request().method() === 'POST') {
            const body = (await route.request().postDataJSON()) as {
                type: 'EXPENSE'
                amount: number
                date: string
                accountId: string
                categoryId: string
                merchant?: string | null
                note?: string | null
            }
            const transaction = createTransaction(
                `transaction-${nextTransactionId++}`,
                body.categoryId,
                {
                    amount: body.amount,
                    date: body.date,
                    accountId: body.accountId,
                    merchant: body.merchant ?? null,
                    note: body.note ?? null,
                },
            )
            transactions.push(transaction)
            return fulfill(route, transaction, 201).then(() => undefined)
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

        return fulfill(route, transaction).then(() => undefined)
    })

    return { sections, budgets, transactions }
}

const buildBudgetResponse = (budget: Budget, sections: Section[], transactions: Transaction[]) => {
    const category = sections
        .flatMap((section) => section.categories)
        .find((item) => item.id === budget.categoryId)
    const qualifyingTransactions = transactions.filter(
        (transaction) =>
            !transaction.isArchived &&
            transaction.type === 'EXPENSE' &&
            transaction.categoryId === budget.categoryId &&
            monthOf(transaction.date) === budget.month,
    )
    const spent = qualifyingTransactions.reduce(
        (total, transaction) => total + transaction.amount,
        0,
    )
    const progress = budget.amount === 0 ? (spent === 0 ? 0 : 100) : (spent / budget.amount) * 100

    return {
        ...budget,
        spent,
        remaining: budget.amount - spent,
        progress,
        isOverBudget: spent > budget.amount,
        transactionCount: qualifyingTransactions.length,
        category: {
            ...category,
            section: sections.find((section) => section.id === category?.sectionId),
        },
    }
}

const login = async (page: Parameters<typeof mockAuthenticatedSession>[0]) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.login('test@example.com', 'Password123')
    await page.waitForURL(/\/dashboard/)
}

const chooseOption = async (page: Page, label: string, option: string) => {
    await page.getByRole('combobox', { name: label }).click()
    await page.getByRole('option', { name: option }).click()
}

const budgetCard = (page: Parameters<typeof mockAuthenticatedSession>[0]) =>
    page.locator('div.rounded-xl').filter({ hasText: 'Groceries' }).last()

const expectBudgetValues = async (
    page: Parameters<typeof mockAuthenticatedSession>[0],
    spent: number,
    remaining: number,
) => {
    const card = budgetCard(page)
    await expect(card).toContainText('Spent')
    await expect(card).toContainText(String(spent))
    await expect(card).toContainText(String(remaining))
}

test('keeps a selected-month Budget synchronized with expense create, month move, and archive', async ({
    page,
}) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await mockAuthenticatedSession(page)
    await setupBudgetApi(page)
    await login(page)

    await page.goto('/categories?month=2026-06')
    await page.getByRole('heading', { name: 'Categories' }).waitFor()
    await page.getByTestId('primary-action-button').click()
    await page.getByLabel('Category name').fill('Groceries')
    await chooseOption(page, 'Section', 'Food')
    await page.getByRole('button', { name: 'Create category' }).click()
    await expect(page.getByText('Groceries')).toBeVisible()

    await page.goto('/budgets?month=2026-06')
    await page.getByRole('heading', { name: 'Budgets', exact: true }).waitFor()
    await page.getByTestId('primary-action-button').click()
    await chooseOption(page, 'Category', 'Groceries')
    await page.locator('#budget-month').fill('2026-06')
    await page.locator('#budget-amount').fill('100')
    await page.getByRole('button', { name: 'Create budget' }).click()
    await expectBudgetValues(page, 0, 100)

    await page.goto('/transactions?month=2026-06')
    await page.getByRole('heading', { name: 'Transactions', exact: true }).waitFor()
    await page.getByTestId('primary-action-button').click()
    const firstTransactionDialog = page.getByRole('dialog', { name: 'New Transaction' })
    await firstTransactionDialog.getByLabel('Amount').fill('25')
    await firstTransactionDialog.getByLabel('Date').fill('2026-06-15')
    await chooseOption(page, 'Account', 'Checking')
    await chooseOption(page, 'Category (optional)', 'Groceries')
    await firstTransactionDialog.getByLabel('Merchant (optional)').fill('June groceries')
    await firstTransactionDialog.getByRole('button', { name: 'Save' }).click()
    await expect(page.getByText('June groceries')).toBeVisible()

    await page.goto('/budgets?month=2026-06')
    await expectBudgetValues(page, 25, 75)

    await page.goto('/transactions?month=2026-06')
    await expect(page.getByText('June groceries')).toBeVisible()
    await page
        .getByText('June groceries')
        .locator('xpath=ancestor::div[contains(@class,"rounded")]')
        .getByRole('button', { name: 'Edit' })
        .click()
    const editDialog = page.getByRole('dialog', { name: 'Edit transaction' })
    await editDialog.getByLabel('Date').fill('2026-07-01')
    await editDialog.getByRole('button', { name: 'Save' }).click()
    await expect(page.getByText('June groceries')).not.toBeVisible()

    await page.goto('/budgets?month=2026-06')
    await expectBudgetValues(page, 0, 100)

    await page.goto('/transactions?month=2026-06')
    await page.getByTestId('primary-action-button').click()
    const secondTransactionDialog = page.getByRole('dialog', { name: 'New Transaction' })
    await secondTransactionDialog.getByLabel('Amount').fill('10')
    await secondTransactionDialog.getByLabel('Date').fill('2026-06-20')
    await chooseOption(page, 'Account', 'Checking')
    await chooseOption(page, 'Category (optional)', 'Groceries')
    await secondTransactionDialog.getByLabel('Merchant (optional)').fill('Archived groceries')
    await secondTransactionDialog.getByRole('button', { name: 'Save' }).click()
    await expect(page.getByText('Archived groceries')).toBeVisible()

    await page.goto('/budgets?month=2026-06')
    await expectBudgetValues(page, 10, 90)

    await page.goto('/transactions?month=2026-06')
    await page
        .getByText('Archived groceries')
        .locator('xpath=ancestor::div[contains(@class,"rounded")]')
        .getByRole('button', { name: /Archive transaction/ })
        .click()
    await page.getByRole('alertdialog').getByRole('button', { name: 'Archive' }).click()
    await expect(page.getByText('Archived groceries')).not.toBeVisible()

    await page.goto('/budgets?month=2026-06')
    await expectBudgetValues(page, 0, 100)

    await budgetCard(page).getByRole('button', { name: 'Edit Groceries' }).click()
    const editBudgetDialog = page.getByRole('dialog', { name: 'Edit budget' })
    await editBudgetDialog.getByLabel('Amount').fill('200')
    await editBudgetDialog.getByRole('button', { name: 'Save changes' }).click()
    await expectBudgetValues(page, 0, 200)
})

test('keeps long-name, high-value budgets and dialogs usable at responsive viewports', async ({
    page,
}) => {
    const categoryName = 'Household essentials and recurring home maintenance expenses'
    const amount = 9_999_999_999.99
    const formattedAmount = new Intl.NumberFormat('fr-CA', {
        style: 'currency',
        currency: 'CAD',
        maximumFractionDigits: 2,
    }).format(amount)

    await page.setViewportSize({ width: 390, height: 844 })
    await mockAuthenticatedSession(page)
    await setupBudgetApi(page)
    await login(page)

    await page.goto('/categories?month=2026-06')
    await page.getByRole('heading', { name: 'Categories' }).waitFor()
    await page.getByTestId('primary-action-button').click()
    await page.getByLabel('Category name').fill(categoryName)
    await page.getByRole('radio', { name: 'Shopping bag' }).click()
    await chooseOption(page, 'Section', 'Food')
    await page.getByRole('button', { name: 'Create category' }).click()
    await expect(page.getByText(categoryName)).toBeVisible()

    await page.goto('/budgets?month=2026-06')
    await page.getByRole('heading', { name: 'Budgets', exact: true }).waitFor()
    await page.setViewportSize({ width: 320, height: 400 })
    await page.getByTestId('primary-action-button').click()

    const createDialog = page.getByRole('dialog', { name: 'New Budget' })
    await expect(createDialog).toBeVisible()
    await chooseOption(page, 'Category', categoryName)
    await page.locator('#budget-month').fill('2026-06')
    await page.locator('#budget-amount').fill(String(amount))

    const createDialogBox = await createDialog.boundingBox()
    const createDialogScrolls = await createDialog.evaluate(
        (element) => element.scrollHeight > element.clientHeight,
    )
    expect(createDialogBox).not.toBeNull()
    if (createDialogBox) {
        expect(createDialogBox.y).toBeGreaterThanOrEqual(0)
        expect(createDialogBox.y + createDialogBox.height).toBeLessThanOrEqual(400)
    }
    expect(createDialogScrolls).toBe(true)

    const createButton = createDialog.getByRole('button', { name: 'Create budget' })
    await createButton.scrollIntoViewIfNeeded()
    await expect(createButton).toBeVisible()
    await createButton.click()

    const card = page.getByRole('listitem').filter({ hasText: categoryName })
    await expect(card).toBeVisible()
    await expect(
        card.getByRole('progressbar', { name: `Budget usage for ${categoryName}` }),
    ).toBeVisible()

    for (const width of [320, 430, 768, 1280]) {
        await page.setViewportSize({ width, height: 800 })

        expect(
            await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
        ).toBe(true)
        const categoryHeading = card.getByRole('heading', { name: categoryName })
        await expect(categoryHeading).toBeVisible()
        expect(
            await categoryHeading.evaluate((element) => element.scrollWidth <= element.clientWidth),
        ).toBe(true)

        const plannedAmount = card.getByText(formattedAmount, { exact: true })
        await expect(plannedAmount).toBeVisible()
        expect(
            await plannedAmount.evaluate((element) => element.scrollWidth <= element.clientWidth),
        ).toBe(true)
        const progress = card.getByRole('progressbar', {
            name: `Budget usage for ${categoryName}`,
        })
        await expect(progress).toBeVisible()
        await expect(progress).toHaveAttribute('aria-valuetext', '0% used')

        await expect(card.getByRole('button', { name: `Edit ${categoryName}` })).toBeEnabled()
        await expect(card.getByRole('button', { name: `Archive ${categoryName}` })).toBeEnabled()

        if (width < 1024) {
            await expect(page.getByTestId('mobile-bottom-nav')).toBeVisible()
        } else {
            await expect(page.getByTestId('mobile-bottom-nav')).toBeHidden()
        }
    }

    await page.setViewportSize({ width: 320, height: 400 })
    await card.getByRole('button', { name: `Edit ${categoryName}` }).click()

    const editDialog = page.getByRole('dialog', { name: 'Edit budget' })
    await expect(editDialog).toBeVisible()
    await expect(editDialog.getByLabel('Amount')).toBeVisible()
    await expect(editDialog.getByLabel('Month')).toBeVisible()

    const editDialogBox = await editDialog.boundingBox()
    const editDialogScrolls = await editDialog.evaluate(
        (element) => element.scrollHeight > element.clientHeight,
    )
    expect(editDialogBox).not.toBeNull()
    if (editDialogBox) {
        expect(editDialogBox.y).toBeGreaterThanOrEqual(0)
        expect(editDialogBox.y + editDialogBox.height).toBeLessThanOrEqual(400)
    }
    expect(editDialogScrolls).toBe(true)
    await editDialog.getByRole('button', { name: 'Save changes' }).scrollIntoViewIfNeeded()
    await expect(editDialog.getByRole('button', { name: 'Save changes' })).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(editDialog).not.toBeVisible()

    await page.setViewportSize({ width: 320, height: 800 })
    await page.evaluate(() => {
        document.documentElement.classList.add('dark')
        window.scrollTo(0, document.documentElement.scrollHeight)
    })
    await expect(card.getByRole('button', { name: `Edit ${categoryName}` })).toBeVisible()
    await expect(card.getByText(formattedAmount, { exact: true })).toBeVisible()
    await expect(
        card.getByRole('progressbar', { name: `Budget usage for ${categoryName}` }),
    ).toBeVisible()
    await expect(page.getByTestId('mobile-bottom-nav')).toBeVisible()
    expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true)

    const navigationBox = await page.getByTestId('mobile-bottom-nav').boundingBox()
    const editBox = await card.getByRole('button', { name: `Edit ${categoryName}` }).boundingBox()
    const archiveBox = await card
        .getByRole('button', { name: `Archive ${categoryName}` })
        .boundingBox()
    expect(navigationBox).not.toBeNull()
    expect(editBox).not.toBeNull()
    expect(archiveBox).not.toBeNull()
    if (navigationBox && editBox && archiveBox) {
        expect(
            editBox.y + editBox.height <= navigationBox.y ||
                editBox.y >= navigationBox.y + navigationBox.height,
        ).toBe(true)
        expect(
            archiveBox.y + archiveBox.height <= navigationBox.y ||
                archiveBox.y >= navigationBox.y + navigationBox.height,
        ).toBe(true)
    }
})
