import { describe, expect, it } from 'vitest'
import { budgetFormSchema } from './budget.schema'

const validInput = {
    categoryId: 'category-1',
    month: '2026-06',
}

describe('budgetFormSchema', () => {
    it.each([
        ['zero', '0', 0],
        ['positive decimal', '125.50', 125.5],
        ['leading decimal point', '.25', 0.25],
    ] as const)('accepts a %s budget amount', (_label, amount, expected) => {
        const result = budgetFormSchema.safeParse({ ...validInput, amount })

        expect(result.success).toBe(true)
        if (result.success) expect(result.data.amount).toBe(expected)
    })

    it.each([[''], [null], [undefined], ['-1'], ['1.234'], ['10000000000']] as const)(
        'rejects invalid budget amount %s',
        (amount) => {
            expect(budgetFormSchema.safeParse({ ...validInput, amount }).success).toBe(false)
        },
    )

    it('rejects invalid calendar months', () => {
        expect(
            budgetFormSchema.safeParse({
                ...validInput,
                month: '2026-13',
                amount: '0',
            }).success,
        ).toBe(false)
    })
})
