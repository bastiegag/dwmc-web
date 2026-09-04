import { afterEach, describe, it, expect, vi } from 'vitest'
import { authService } from '@/features/auth/services'
import { supabase } from '@/lib/supabase'

afterEach(() => {
    vi.restoreAllMocks()
})

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

        it('does not expose the provider error message', async () => {
            vi.spyOn(supabase.auth, 'signInWithPassword').mockResolvedValueOnce({
                data: { user: null, session: null },
                error: { message: 'provider internals: secret database detail' } as never,
            })

            await expect(
                authService.login({ email: 'test@example.com', password: 'wrongpassword' }),
            ).rejects.toMatchObject({
                message: 'Something went wrong. Please try again.',
                code: 'AUTH_FAILED',
            })
        })

        it('maps invalid credentials to a stable message', async () => {
            vi.spyOn(supabase.auth, 'signInWithPassword').mockResolvedValueOnce({
                data: { user: null, session: null },
                error: Object.assign(new Error('Invalid login credentials'), {
                    code: 'invalid_credentials',
                }) as never,
            })

            await expect(
                authService.login({ email: 'test@example.com', password: 'wrongpassword' }),
            ).rejects.toMatchObject({
                message: 'The email or password is incorrect.',
                code: 'INVALID_CREDENTIALS',
            })
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

        it('maps duplicate emails to a stable message', async () => {
            vi.spyOn(supabase.auth, 'signUp').mockResolvedValueOnce({
                data: { user: null, session: null },
                error: { message: 'User already registered' } as never,
            })

            await expect(
                authService.signup({ email: 'existing@example.com', password: 'Password123' }),
            ).rejects.toMatchObject({
                message: 'An account with this email already exists.',
                code: 'EMAIL_IN_USE',
            })
        })

        it('redirects confirmed users to the protected dashboard', async () => {
            const signUp = vi.spyOn(supabase.auth, 'signUp')
            await authService.signup({ email: 'newuser@example.com', password: 'Password123' })
            expect(signUp).toHaveBeenCalledWith(expect.anything())
            expect(signUp.mock.calls[signUp.mock.calls.length - 1]?.[0]).toEqual(
                expect.objectContaining({
                    options: { emailRedirectTo: expect.stringContaining('/dashboard') },
                }),
            )
        })
    })

    describe('forgotPassword', () => {
        it('resolves without throwing', async () => {
            await expect(authService.forgotPassword('test@example.com')).resolves.toBeUndefined()
        })

        it('maps provider failures to a stable recovery message', async () => {
            vi.spyOn(supabase.auth, 'resetPasswordForEmail').mockResolvedValueOnce({
                data: {},
                error: { message: 'provider reset failure' } as never,
            })

            await expect(authService.forgotPassword('test@example.com')).rejects.toMatchObject({
                message: 'We could not send a password reset link. Please try again.',
                code: 'RECOVERY_FAILED',
            })
        })
    })

    describe('resetPassword', () => {
        it('returns updated user data', async () => {
            const result = await authService.resetPassword('NewPassword123')
            expect(result.user).not.toBeNull()
            expect(result.user?.email).toBe('test@example.com')
        })

        it('maps provider failures to a stable reset message', async () => {
            vi.spyOn(supabase.auth, 'updateUser').mockResolvedValueOnce({
                data: { user: null },
                error: { message: 'provider update failure' } as never,
            })

            await expect(authService.resetPassword('NewPassword123')).rejects.toMatchObject({
                message: 'We could not update your password. Please request a new reset link.',
                code: 'RESET_FAILED',
            })
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
            const result = authService.onAuthStateChange(async () => {})
            expect(typeof result.data.subscription.unsubscribe).toBe('function')
            result.data.subscription.unsubscribe()
        })
    })
})
