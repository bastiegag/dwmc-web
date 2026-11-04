import { test, expect } from '@playwright/test'
import { LoginPage } from './pages/login.page.js'
import { mockAuthenticatedSession } from './auth-fixtures.js'

test.describe('App Layout', () => {
    test.beforeEach(async ({ page }) => {
        await mockAuthenticatedSession(page)

        const loginPage = new LoginPage(page)
        await loginPage.goto()
        await loginPage.login('test@example.com', 'Password123')
        await expect(page).toHaveURL('/dashboard')
    })

    test.describe('Mobile viewport', () => {
        test.use({ viewport: { width: 375, height: 667 } })

        test('shows the mobile bottom navigation', async ({ page }) => {
            await expect(page.getByTestId('mobile-bottom-nav')).toBeVisible()
            await expect(page.getByTestId('desktop-sidebar')).not.toBeVisible()
        })

        test('floating action button opens the transaction dialog on the dashboard', async ({
            page,
        }) => {
            await page.getByTestId('primary-action-button').click()
            await expect(page.getByRole('heading', { name: 'New Transaction' })).toBeVisible()
        })

        test('floating action button opens the budget dialog on the budgets page', async ({
            page,
        }) => {
            await page.goto('/budgets')
            await page.getByTestId('primary-action-button').click()
            await expect(page.getByRole('heading', { name: 'New Budget' })).toBeVisible()
        })

        test('keeps the floating action accessible on the right', async ({ page }) => {
            for (const width of [375, 390, 430, 768]) {
                await page.setViewportSize({ width, height: 844 })
                const navigation = page.getByTestId('mobile-bottom-nav')
                const action = page.getByTestId('primary-action-button')

                await expect(navigation).toBeVisible()
                await expect(action).toBeVisible()
                await expect(action).toBeEnabled()

                const navigationBox = await navigation.boundingBox()
                const actionBox = await action.boundingBox()
                const linkBoxes = await Promise.all(
                    (await navigation.getByRole('link').all()).map((link) => link.boundingBox()),
                )

                expect(navigationBox).not.toBeNull()
                expect(actionBox).not.toBeNull()
                expect(linkBoxes).toHaveLength(4)
                expect(linkBoxes.every((box) => box !== null)).toBe(true)

                if (!navigationBox || !actionBox || linkBoxes.some((box) => box === null)) {
                    continue
                }

                const viewport = page.viewportSize()
                const actionRight = actionBox.x + actionBox.width
                const actionBottom = actionBox.y + actionBox.height
                const navigationBottom = navigationBox.y + navigationBox.height

                expect(actionBox.width).toBeGreaterThanOrEqual(44)
                expect(actionBox.height).toBeGreaterThanOrEqual(44)
                expect(actionBox.x + actionBox.width / 2).toBeGreaterThan(width / 2)
                expect(actionBox.x).toBeGreaterThanOrEqual(0)
                expect(actionRight).toBeLessThanOrEqual(viewport?.width ?? width)
                expect(actionBox.y).toBeGreaterThanOrEqual(0)
                expect(actionBottom).toBeLessThanOrEqual(viewport?.height ?? 844)
                expect(actionBottom <= navigationBox.y || actionBox.y >= navigationBottom).toBe(
                    true,
                )

                for (const linkBox of linkBoxes) {
                    expect(linkBox!.width).toBeGreaterThanOrEqual(44)
                    expect(linkBox!.height).toBeGreaterThanOrEqual(44)
                }
            }
        })
    })

    test.describe('Intermediate viewport widths', () => {
        test('avoids horizontal overflow at 430px', async ({ page }) => {
            await page.setViewportSize({ width: 430, height: 844 })
            await expect(page).toHaveURL('/dashboard')

            const overflow = await page.evaluate(() => ({
                documentWidth: document.documentElement.scrollWidth,
                viewportWidth: document.documentElement.clientWidth,
            }))

            expect(overflow.documentWidth).toBeLessThanOrEqual(overflow.viewportWidth)
        })

        test('avoids horizontal overflow at 768px', async ({ page }) => {
            await page.setViewportSize({ width: 768, height: 900 })
            await expect(page).toHaveURL('/dashboard')

            const overflow = await page.evaluate(() => ({
                documentWidth: document.documentElement.scrollWidth,
                viewportWidth: document.documentElement.clientWidth,
            }))

            expect(overflow.documentWidth).toBeLessThanOrEqual(overflow.viewportWidth)
        })
    })

    test.describe('Desktop viewport', () => {
        test.use({ viewport: { width: 1280, height: 720 } })

        test('shows the desktop sidebar', async ({ page }) => {
            await expect(page.getByTestId('desktop-sidebar')).toBeVisible()
            await expect(page.getByTestId('mobile-bottom-nav')).not.toBeVisible()
        })

        test('month navigator updates the URL', async ({ page }) => {
            await page.goto('/dashboard?month=2026-12')

            await page.getByLabel('Go to next month').click()
            await expect(page).toHaveURL('/dashboard?month=2027-01')
        })

        test('month navigation replaces history instead of adding month entries', async ({
            page,
        }) => {
            await page.goto('/dashboard?month=2026-05')
            const historyLength = await page.evaluate(() => window.history.length)

            await page.getByLabel('Go to next month').click()

            await expect(page).toHaveURL('/dashboard?month=2026-06')
            await expect.poll(() => page.evaluate(() => window.history.length)).toBe(historyLength)
        })
    })
})
