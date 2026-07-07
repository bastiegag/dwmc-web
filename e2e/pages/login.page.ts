import type { Page } from '@playwright/test'

export class LoginPage {
    constructor(public readonly page: Page) {}

    async goto() {
        await this.page.goto('/auth/login')
    }

    async login(email: string, password: string) {
        await this.page.getByLabel('Email').fill(email)
        await this.page.locator('#password').fill(password)
        await this.page.getByRole('button', { name: 'Sign in' }).click()
    }
}
