import { describe, it, expect } from 'vitest'
import { authService } from '@/features/auth/services'

describe('authService', () => {
    describe('login', () => {
        it('returns user and session for valid credentials', async () => {
            const result = await authService.login({
                email: 'test@example.com',
                password: 'Password123',
            })
            expect(result.user).not.toBeNull()
            expect(result.session).not.toBeNull()
        })

        it('throws for invalid credentials', async () => {
            await expect(
                authService.login({ email: 'test@example.com', password: 'wrongpassword' }),
            ).rejects.toThrow()
        })
    })

    describe('signup', () => {
        it('returns user data for a new email', async () => {
            const result = await authService.signup({
                email: 'newuser@example.com',
                password: 'Password123',
            })
            expect(result.user).not.toBeNull()
        })

        it('throws for an already-registered email', async () => {
            await expect(
                authService.signup({ email: 'existing@example.com', password: 'Password123' }),
            ).rejects.toThrow()
        })
    })

    describe('forgotPassword', () => {
        it('resolves without throwing', async () => {
            await expect(authService.forgotPassword('test@example.com')).resolves.toBeUndefined()
        })
    })

    describe('resetPassword', () => {
        it('returns updated user data', async () => {
            const result = await authService.resetPassword('NewPassword123')
            expect(result.user).not.toBeNull()
            expect(result.user?.email).toBe('test@example.com')
        })
    })

    describe('logout', () => {
        it('resolves without throwing', async () => {
            await expect(authService.logout()).resolves.toBeUndefined()
        })
    })

    describe('getSession', () => {
        it('returns null when there is no active session', async () => {
            const session = await authService.getSession()
            expect(session).toBeNull()
        })
    })

    describe('onAuthStateChange', () => {
        it('returns an object with a subscription that has an unsubscribe function', () => {
            const result = authService.onAuthStateChange(() => {})
            expect(typeof result.data.subscription.unsubscribe).toBe('function')
            result.data.subscription.unsubscribe()
        })
    })
})
