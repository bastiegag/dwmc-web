import { z } from 'zod'

export const budgetFormSchema = z.object({
    categoryId: z.string().min(1, 'Category is required'),
    month: z.string().regex(/^\d{4}-\d{2}$/, 'Month must use YYYY-MM format'),
    amount: z.coerce.number().min(0, 'Budget amount must be greater than or equal to 0'),
})

export type BudgetFormValues = z.infer<typeof budgetFormSchema>
