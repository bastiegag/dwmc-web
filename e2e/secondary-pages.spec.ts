import { expect, test } from '@playwright/test'

const authPages = [
    { path: '/login', heading: 'Welcome back', action: 'Sign in', actionRole: 'button' },
    {
        path: '/signup',
        heading: 'Create an account',
        action: 'Create account',
        actionRole: 'button',
    },
    {
        path: '/forgot-password',
        heading: 'Forgot password?',
        action: 'Send reset link',
        actionRole: 'button',
    },
    {
        path: '/reset-password',
        heading: 'Link expired or invalid',
        action: 'Request a new password reset',
        actionRole: 'link',
    },
] as const

test('authentication pages remain usable without horizontal overflow across viewports', async ({
    page,
}) => {
    for (const width of [320, 430, 768, 1280]) {
        await page.setViewportSize({ width, height: 900 })

        for (const authPage of authPages) {
            await page.goto(authPage.path)
            await expect(page.getByRole('heading', { name: authPage.heading })).toBeVisible()

            const action =
                authPage.actionRole === 'button'
                    ? page.getByRole('button', { name: authPage.action })
                    : page.getByRole('link', { name: authPage.action })
            await expect(action).toBeVisible()

            const bounds = await action.boundingBox()
            expect(bounds).not.toBeNull()
            expect(bounds!.x).toBeGreaterThanOrEqual(0)
            expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width)
            expect(
                await page.evaluate(
                    () =>
                        document.documentElement.scrollWidth <=
                        document.documentElement.clientWidth,
                ),
            ).toBe(true)
        }
    }

    await page.setViewportSize({ width: 320, height: 480 })
    await page.goto('/signup')
    const createAccount = page.getByRole('button', { name: 'Create account' })
    await createAccount.scrollIntoViewIfNeeded()
    const createAccountBounds = await createAccount.boundingBox()
    expect(createAccountBounds).not.toBeNull()
    expect(createAccountBounds!.y + createAccountBounds!.height).toBeLessThanOrEqual(480)

    await page.locator('html').evaluate((element) => element.classList.add('dark'))
    expect(
        await page.evaluate(
            () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
        ),
    ).toBe(true)
})
