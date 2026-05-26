import { describe, it, expect } from 'vitest'
import { passwordSchema, signupSchema, resetPasswordSchema } from '../index'

// Helper: build a string of exact length
const str = (len: number) => 'A'.repeat(Math.max(0, len - 3)) + 'a1!'

describe('passwordSchema', () => {
    it('accepts a valid password', () => {
        expect(passwordSchema.safeParse('Password1').success).toBe(true)
    })

    it('rejects a password shorter than 8 characters', () => {
        const result = passwordSchema.safeParse('Ab1')
        expect(result.success).toBe(false)
        expect(result.error?.issues[0].message).toMatch(/at least 8 characters/)
    })

    it('rejects a password longer than 72 characters (bcrypt boundary)', () => {
        const result = passwordSchema.safeParse(str(73))
        expect(result.success).toBe(false)
        expect(result.error?.issues[0].message).toMatch(/at most 72 characters/)
    })

    it('accepts a password of exactly 72 characters', () => {
        expect(passwordSchema.safeParse(str(72)).success).toBe(true)
    })

    it('accepts a password of exactly 8 characters', () => {
        expect(passwordSchema.safeParse('Passw0rd').success).toBe(true)
    })

    it('rejects a password missing an uppercase letter', () => {
        const result = passwordSchema.safeParse('password1')
        expect(result.success).toBe(false)
        expect(result.error?.issues[0].message).toMatch(/uppercase/)
    })

    it('rejects a password missing a lowercase letter', () => {
        const result = passwordSchema.safeParse('PASSWORD1')
        expect(result.success).toBe(false)
        expect(result.error?.issues[0].message).toMatch(/lowercase/)
    })

    it('rejects a password missing a digit', () => {
        const result = passwordSchema.safeParse('PasswordA')
        expect(result.success).toBe(false)
        expect(result.error?.issues[0].message).toMatch(/number/)
    })
})

describe('signupSchema — confirmPassword', () => {
    const base = { email: 'a@b.com', password: 'Password1', confirmPassword: 'Password1' }

    it('accepts matching passwords', () => {
        expect(signupSchema.safeParse(base).success).toBe(true)
    })

    it('rejects mismatched passwords', () => {
        const result = signupSchema.safeParse({ ...base, confirmPassword: 'Different1' })
        expect(result.success).toBe(false)
        expect(result.error?.issues[0].message).toMatch(/do not match/)
    })
})

describe('resetPasswordSchema — confirmPassword', () => {
    const base = { password: 'Password1', confirmPassword: 'Password1' }

    it('accepts matching passwords', () => {
        expect(resetPasswordSchema.safeParse(base).success).toBe(true)
    })

    it('rejects mismatched passwords', () => {
        const result = resetPasswordSchema.safeParse({ ...base, confirmPassword: 'Different1' })
        expect(result.success).toBe(false)
        expect(result.error?.issues[0].message).toMatch(/do not match/)
    })
})
