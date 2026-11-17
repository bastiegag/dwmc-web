import { expect, test } from '@playwright/test'
import { mockAuthenticatedSession } from './auth-fixtures.js'
import { LoginPage } from './pages/login.page.js'

const selectSection = async (page: import('@playwright/test').Page, name: string) => {
    await page.getByRole('combobox', { name: 'Section' }).click()
    await page.getByRole('option', { name }).click()
}

test('authenticated users can manage Sections and Categories', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await mockAuthenticatedSession(page)

    let section = {
        id: 'section-1',
        name: 'Food',
        color: '#22c55e',
        isArchived: false,
        categories: [],
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
    }
    let category = {
        id: 'category-1',
        name: 'Groceries',
        icon: 'shopping-cart',
        sectionId: section.id,
        isArchived: false,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
    }

    await page.route(/\/api\/v1\/sections(?:\?.*)?$/, async (route) => {
        if (route.request().method() === 'GET') {
            return route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    data: section.isArchived
                        ? []
                        : [
                              {
                                  ...section,
                                  categories: category.isArchived ? [] : [category],
                              },
                          ],
                    nextCursor: null,
                }),
            })
        }

        if (route.request().method() === 'POST') {
            const body = (await route.request().postDataJSON()) as { name: string; color: string }
            section = { ...section, name: body.name, color: body.color }
            return route.fulfill({
                status: 201,
                contentType: 'application/json',
                body: JSON.stringify({ data: section }),
            })
        }

        if (route.request().method() === 'PATCH') {
            const body = (await route.request().postDataJSON()) as Partial<typeof section>
            section = { ...section, ...body }
            return route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ data: section }),
            })
        }

        section = { ...section, isArchived: true }
        category = { ...category, isArchived: true }
        return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ data: section }),
        })
    })

    await page.route(/\/api\/v1\/sections\/[^/]+$/, async (route) => {
        section = { ...section, isArchived: true }
        category = { ...category, isArchived: true }
        return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ data: section }),
        })
    })

    await page.route(/\/api\/v1\/categories(?:\?.*)?$/, async (route) => {
        if (route.request().method() === 'POST') {
            const body = (await route.request().postDataJSON()) as Partial<typeof category>
            category = { ...category, ...body, isArchived: false }
            return route.fulfill({
                status: 201,
                contentType: 'application/json',
                body: JSON.stringify({ data: category }),
            })
        }

        return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ data: [category], nextCursor: null }),
        })
    })

    await page.route(/\/api\/v1\/categories\/[^/]+$/, async (route) => {
        if (route.request().method() === 'PATCH') {
            const body = (await route.request().postDataJSON()) as Partial<typeof category>
            category = { ...category, ...body }
        } else if (route.request().method() === 'DELETE') {
            category = { ...category, isArchived: true }
        }

        return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ data: category }),
        })
    })

    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.login('test@example.com', 'Password123')
    await page.goto('/categories')

    await expect(page.getByRole('heading', { name: 'Categories' })).toBeVisible()
    await expect(page.getByText('Food')).toBeVisible()

    await page.getByTestId('primary-action-button').click()
    await page.getByLabel('Category name').fill('Groceries')
    await page.getByLabel('Icon').fill('shopping-cart')
    await selectSection(page, 'Food')
    await page.getByRole('button', { name: 'Create category' }).click()
    await expect(page.getByText('Groceries')).toBeVisible()

    await page.getByRole('button', { name: 'Edit category Groceries' }).click()
    await page.getByLabel('Category name').fill('Weekly groceries')
    await page.getByRole('button', { name: 'Save changes' }).click()
    await expect(page.getByText('Weekly groceries')).toBeVisible()

    const archiveCategory = page.getByRole('button', { name: 'Archive category Weekly groceries' })
    await archiveCategory.click()
    const confirmation = page.getByRole('alertdialog')
    await expect(confirmation.locator(':focus')).toBeVisible()
    await confirmation.getByRole('button', { name: 'Cancel' }).click()
    await expect(confirmation).not.toBeVisible()
    await expect(archiveCategory).toBeFocused()

    await archiveCategory.click()
    await confirmation.getByRole('button', { name: 'Archive' }).click()
    await expect(
        page
            .getByRole('list', { name: 'Categories list' })
            .locator('span.text-sm.font-medium', { hasText: 'Weekly groceries' }),
    ).not.toBeVisible()

    await page.getByRole('button', { name: 'Archive section Food' }).click()
    await page.getByRole('alertdialog').getByRole('button', { name: 'Archive' }).click()
    await expect(page.getByRole('button', { name: 'Archive section Food' })).not.toBeVisible()
})

test('a new user can create a section and then organize a category inside it', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await mockAuthenticatedSession(page)

    let section: Record<string, unknown> | null = null
    let category: Record<string, unknown> | null = null

    await page.route(/\/api\/v1\/sections(?:\?.*)?$/, async (route) => {
        if (route.request().method() === 'POST') {
            const body = (await route.request().postDataJSON()) as { name: string; color: string }
            section = {
                id: 'section-new',
                name: body.name,
                color: body.color,
                isArchived: false,
                categories: category ? [category] : [],
                createdAt: '2026-01-01T00:00:00.000Z',
                updatedAt: '2026-01-01T00:00:00.000Z',
            }
            return route.fulfill({
                status: 201,
                contentType: 'application/json',
                body: JSON.stringify({ data: section }),
            })
        }

        return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ data: section ? [section] : [], nextCursor: null }),
        })
    })

    await page.route(/\/api\/v1\/categories(?:\?.*)?$/, async (route) => {
        if (route.request().method() === 'POST') {
            const body = (await route.request().postDataJSON()) as {
                name: string
                icon: string
                sectionId: string
            }
            category = {
                id: 'category-new',
                ...body,
                isArchived: false,
                createdAt: '2026-01-01T00:00:00.000Z',
                updatedAt: '2026-01-01T00:00:00.000Z',
            }
            if (section) section = { ...section, categories: [category] }
            return route.fulfill({
                status: 201,
                contentType: 'application/json',
                body: JSON.stringify({ data: category }),
            })
        }

        return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ data: category ? [category] : [], nextCursor: null }),
        })
    })

    await page.route(/\/api\/v1\/categories\/[^/]+$/, async (route) => {
        if (route.request().method() === 'PATCH') {
            const body = (await route.request().postDataJSON()) as Partial<
                NonNullable<typeof category>
            >
            category = { ...category, ...body }
            if (section) section = { ...section, categories: [category] }
        }

        return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ data: category }),
        })
    })

    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.login('test@example.com', 'Password123')
    await page.goto('/categories')

    await expect(page.getByRole('heading', { name: 'No categories yet' })).toBeVisible()
    await page.getByTestId('primary-action-button').click()
    await page.getByLabel('Section name').fill('Food')
    await page.getByRole('button', { name: 'Create section' }).click()
    await expect(page.getByText('Food')).toBeVisible()

    await page.getByTestId('primary-action-button').click()
    await page.getByLabel('Category name').fill('Groceries')
    await page.getByLabel('Icon').fill('shopping-cart')
    await selectSection(page, 'Food')
    await page.getByRole('button', { name: 'Create category' }).click()

    await expect(page.getByText('Groceries')).toBeVisible()
    await page.getByRole('button', { name: 'Edit category Groceries' }).click()
    await page.getByLabel('Category name').fill('Weekly groceries')
    await page.getByRole('button', { name: 'Save changes' }).click()
    await expect(page.getByText('Weekly groceries')).toBeVisible()
})

test('category layout and dialogs adapt across responsive viewports', async ({ page }) => {
    await mockAuthenticatedSession(page)

    const sectionName = 'Household essentials and everyday expenses'
    const categoryName = 'Groceries and fresh produce for the entire household throughout the month'
    const section = {
        id: 'section-responsive',
        name: sectionName,
        color: '#22c55e',
        isArchived: false,
        categories: [
            {
                id: 'category-responsive',
                name: categoryName,
                icon: 'shopping-cart',
                sectionId: 'section-responsive',
                isArchived: false,
                createdAt: '2026-01-01T00:00:00.000Z',
                updatedAt: '2026-01-01T00:00:00.000Z',
            },
        ],
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
    }

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

    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.login('test@example.com', 'Password123')
    await page.goto('/categories')
    await expect(page.getByRole('heading', { name: sectionName })).toBeVisible()
    await expect(page.getByText(categoryName)).toBeVisible()

    for (const width of [320, 430, 768, 1280]) {
        await page.setViewportSize({ width, height: 900 })
        await expect(
            page.getByRole('button', { name: `Edit category ${categoryName}` }),
        ).toBeVisible()
        expect(
            await page.evaluate(
                () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
            ),
        ).toBe(true)

        if (width < 1024) {
            const navigation = page.getByTestId('mobile-bottom-nav')
            await expect(navigation).toBeVisible()
            const editButton = page.getByRole('button', { name: `Edit category ${categoryName}` })
            await editButton.scrollIntoViewIfNeeded()
            const actionBounds = await editButton.boundingBox()
            const navigationBounds = await navigation.boundingBox()
            expect(actionBounds).not.toBeNull()
            expect(navigationBounds).not.toBeNull()
            expect(actionBounds!.y + actionBounds!.height).toBeLessThanOrEqual(navigationBounds!.y)
        }
    }

    await page.setViewportSize({ width: 320, height: 320 })
    await page.locator('html').evaluate((element) => element.classList.add('dark'))
    await page.getByRole('button', { name: `Edit category ${categoryName}` }).click()
    const editDialog = page.getByRole('dialog', { name: 'Edit category' })
    await expect(editDialog).toBeVisible()
    const editDialogBounds = await editDialog.boundingBox()
    expect(editDialogBounds).not.toBeNull()
    expect(editDialogBounds!.x).toBeGreaterThanOrEqual(0)
    expect(editDialogBounds!.x + editDialogBounds!.width).toBeLessThanOrEqual(320)
    await page.keyboard.press('Escape')
    await expect(editDialog).not.toBeVisible()

    await page.getByTestId('primary-action-button').click()
    const dialog = page.getByRole('dialog', { name: 'Create category' })
    await expect(dialog).toBeVisible()

    const dialogBounds = await dialog.boundingBox()
    expect(dialogBounds).not.toBeNull()
    expect(dialogBounds!.x).toBeGreaterThanOrEqual(0)
    expect(dialogBounds!.x + dialogBounds!.width).toBeLessThanOrEqual(320)
    expect(
        await page.evaluate(
            () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
        ),
    ).toBe(true)

    const dialogDimensions = await dialog.evaluate((element) => ({
        clientHeight: element.clientHeight,
        scrollHeight: element.scrollHeight,
    }))
    expect(dialogDimensions.scrollHeight).toBeGreaterThan(dialogDimensions.clientHeight)
    await dialog.evaluate((element) => {
        element.scrollTop = element.scrollHeight
    })
    await expect(dialog.getByRole('button', { name: 'Create category' })).toBeVisible()
})
