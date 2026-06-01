import { z } from 'zod'

export const categoryFormSchema = z.object({
    name: z.string().trim().min(1, 'Category name is required').max(80),
    icon: z.string().trim().min(1, 'Icon is required').max(80),
    sectionId: z.string().min(1, 'Section is required'),
})

export type CategoryFormValues = z.infer<typeof categoryFormSchema>
