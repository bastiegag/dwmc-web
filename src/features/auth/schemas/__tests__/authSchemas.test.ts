import { describe, it, expect } from 'vitest'
import {
    loginSchema,
    signupSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
} from '@/features/auth/schemas'

describe('loginSchema', () => {
    it('validates valid credentials', () => {
        expect(loginSchema.safeParse({ email: 'test@example.com', password: 'pass' }).success).toBe(
            true,
        )
    })
    it('rejects empty email', () => {
        expect(loginSchema.safeParse({ email: '', password: 'pass' }).success).toBe(false)
    })
    it('rejects invalid email', () => {
        expect(loginSchema.safeParse({ email: 'bad', password: 'pass' }).success).toBe(false)
    })
    it('rejects empty password', () => {
        expect(loginSchema.safeParse({ email: 'test@example.com', password: '' }).success).toBe(
            false,
        )
    })
})

describe('signupSchema', () => {
    const valid = {
        email: 'test@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
    }
    it('validates valid signup data', () => {
        expect(signupSchema.safeParse(valid).success).toBe(true)
    })
    it('rejects password without uppercase', () => {
        expect(
            signupSchema.safeParse({
                ...valid,
                password: 'password123',
                confirmPassword: 'password123',
            }).success,
        ).toBe(false)
    })
    it('rejects mismatched passwords', () => {
        const result = signupSchema.safeParse({ ...valid, confirmPassword: 'Different123' })
        expect(result.success).toBe(false)
        if (!result.success) {
            expect(result.error.errors.find((e) => e.path[0] === 'confirmPassword')?.message).toBe(
                'Passwords do not match',
            )
        }
    })
})

describe('forgotPasswordSchema', () => {
    it('validates valid email', () => {
        expect(forgotPasswordSchema.safeParse({ email: 'test@example.com' }).success).toBe(true)
    })
    it('rejects invalid email', () => {
        expect(forgotPasswordSchema.safeParse({ email: 'bad' }).success).toBe(false)
    })
})

describe('resetPasswordSchema', () => {
    it('validates matching passwords', () => {
        expect(
            resetPasswordSchema.safeParse({
                password: 'Password123',
                confirmPassword: 'Password123',
            }).success,
        ).toBe(true)
    })
    it('rejects mismatched passwords', () => {
        expect(
            resetPasswordSchema.safeParse({
                password: 'Password123',
                confirmPassword: 'Different123',
            }).success,
        ).toBe(false)
    })
})
