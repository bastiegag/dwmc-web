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

const startingBalanceSchema = z
    .union([z.number(), z.string(), z.null()])
    .transform((value) => (value === null || value === '' ? 0 : Number(value)))
    .pipe(z.number().finite())
    .default(0)

const goalSchema = z
    .union([z.number(), z.string(), z.null(), z.undefined()])
    .transform((value) =>
        value === undefined ? undefined : value === null || value === '' ? null : Number(value),
    )
    .pipe(z.number().finite().positive().nullable().optional())

export const accountFormSchema = z
    .object({
        name: z.string().trim().min(1, 'Account name is required').max(80),
        type: accountTypeSchema.default('CHECKING'),
        startingBalance: startingBalanceSchema,
        goal: goalSchema,
        color: z.string().trim().min(1, 'Color is required').max(40),
        icon: z.string().trim().min(1, 'Icon is required').max(80),
    })
    .superRefine((data, ctx) => {
        if (data.goal !== null && data.goal !== undefined && data.type !== 'SAVINGS') {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Goals are only available for savings accounts',
                path: ['goal'],
            })
        }
    })

export type AccountFormInput = z.input<typeof accountFormSchema>
export type AccountFormValues = z.output<typeof accountFormSchema>
