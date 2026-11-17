import { z } from 'zod'

export const categoryFormSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, 'Category name is required')
        .max(80, 'Category name is too long'),
    icon: z.string().trim().min(1, 'Icon is required').max(80, 'Icon value is too long'),
    sectionId: z.string().min(1, 'Section is required'),
})

export type CategoryFormValues = z.infer<typeof categoryFormSchema>
export type CategoryFormSubmitValues = CategoryFormValues | Omit<CategoryFormValues, 'sectionId'>
