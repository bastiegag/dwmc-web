import { z } from 'zod'

const MAX_BUDGET_CENTS = 999_999_999_999n

const budgetAmountSchema = z
    .union([z.string(), z.null(), z.undefined()])
    .transform((value) => value ?? '')
    .refine((value) => value.trim().length > 0, 'Budget amount is required')
    .refine(
        (value) => /^\d+(?:\.\d{0,2})?$|^\.\d{1,2}$/.test(value),
        'Budget amount must be non-negative and have at most 2 decimal places',
    )
    .refine((value) => {
        const [whole = '0', fraction = ''] = value.split('.')
        if (!/^\d+$/.test(whole || '0') || fraction.length > 2) return false

        return (
            BigInt(whole || '0') * 100n + BigInt(fraction.padEnd(2, '0') || '0') <= MAX_BUDGET_CENTS
        )
    }, 'Budget amount exceeds the maximum supported value')
    .transform(Number)
    .pipe(z.number().finite().min(0, 'Budget amount must be greater than or equal to 0'))

export const budgetFormSchema = z.object({
    categoryId: z.string().min(1, 'Category is required'),
    month: z
        .string()
        .regex(/^\d{4}-\d{2}$/, 'Month must use YYYY-MM format')
        .refine((value) => {
            const month = Number(value.slice(5, 7))
            return month >= 1 && month <= 12
        }, 'Month must be a valid calendar month'),
    amount: budgetAmountSchema,
})

export type BudgetFormInput = z.input<typeof budgetFormSchema>
export type BudgetFormValues = z.output<typeof budgetFormSchema>
