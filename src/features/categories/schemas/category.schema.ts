import { z } from 'zod'
import { isFinanceIconName, type FinanceIconName } from '@/shared/finance-icons'

export const categoryFormSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, 'Category name is required')
        .max(80, 'Category name is too long'),
    icon: z.custom<FinanceIconName>(isFinanceIconName, 'Select a supported icon'),
    sectionId: z.string().min(1, 'Section is required'),
})

export type CategoryFormValues = z.infer<typeof categoryFormSchema>
export type CategoryFormSubmitValues = CategoryFormValues | Omit<CategoryFormValues, 'sectionId'>
