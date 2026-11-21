import { z } from 'zod'
import { isSupportedMoneyAmount } from '@/shared/money'
import { isFinanceIconName, type FinanceIconName } from '@/shared/finance-icons'
import { isSemanticColor, type SemanticColor } from '@/shared/semantic-colors'

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
    .refine(
        (value) =>
            value === null ||
            (typeof value === 'string' && value.trim() === '') ||
            isSupportedMoneyAmount(value),
        'Starting balance must have at most 2 decimal places and be within the supported range',
    )
    .transform((value) => (value === null || value === '' ? 0 : Number(value)))
    .pipe(z.number().finite())
    .default(0)

const goalSchema = z
    .union([z.number(), z.string(), z.null(), z.undefined()])
    .refine(
        (value) =>
            value === null ||
            value === undefined ||
            (typeof value === 'string' && value.trim() === '') ||
            isSupportedMoneyAmount(value),
        'Goal must have at most 2 decimal places and be within the supported range',
    )
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
        color: z.custom<SemanticColor>(isSemanticColor, 'Select a supported color'),
        icon: z.custom<FinanceIconName>(isFinanceIconName, 'Select a supported icon'),
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
