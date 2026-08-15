import { expect, test } from '@playwright/test'
import { mockAuthenticatedSession } from './auth-fixtures.js'
import { LoginPage } from './pages/login.page.js'

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
    await page.getByLabel('Section', { exact: true }).selectOption('section-1')
    await page.getByRole('button', { name: 'Create category' }).click()
    await expect(page.getByText('Groceries')).toBeVisible()

    await page.getByRole('button', { name: 'Edit category Groceries' }).click()
    await page.getByLabel('Category name').fill('Weekly groceries')
    await page.getByRole('button', { name: 'Save changes' }).click()
    await expect(page.getByText('Weekly groceries')).toBeVisible()

    await page.getByRole('button', { name: 'Archive category Weekly groceries' }).click()
    await page.getByRole('alertdialog').getByRole('button', { name: 'Archive' }).click()
    await expect(
        page
            .getByRole('list', { name: 'Categories list' })
            .locator('span.text-sm.font-medium', { hasText: 'Weekly groceries' }),
    ).not.toBeVisible()

    await page.getByRole('button', { name: 'Archive section Food' }).click()
    await page.getByRole('alertdialog').getByRole('button', { name: 'Archive' }).click()
    await expect(page.getByRole('button', { name: 'Archive section Food' })).not.toBeVisible()
})
