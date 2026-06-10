import { z } from 'zod'

export const accountTypeSchema = z.enum([
    'CHECKING',
    'SAVINGS',
    'CREDIT_CARD',
    'CASH',
    'INVESTMENT',
    'LOAN',
    'OTHER',
])

export const accountFormSchema = z.object({
    name: z.string().trim().min(1, 'Account name is required').max(80),
    type: accountTypeSchema.default('CHECKING'),
    startingBalance: z.coerce.number().default(0),
    goal: z.preprocess((v) => {
        if (v === '' || v === undefined) return null
        return Number(v)
    }, z.number().nullable().optional()),
    color: z.string().trim().min(1, 'Color is required').max(40),
    icon: z.string().trim().min(1, 'Icon is required').max(80),
})

export type AccountFormValues = z.infer<typeof accountFormSchema>
