import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { mockAuthenticatedSession } from './auth-fixtures.js'
import { LoginPage } from './pages/login.page.js'

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

        expect(violations, `${path} has accessibility violations:\n${summary}`).toEqual([])
    }
})
