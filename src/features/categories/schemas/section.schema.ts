import { z } from 'zod'

export const sectionFormSchema = z.object({
    name: z.string().trim().min(1, 'Section name is required').max(80, 'Section name is too long'),
    color: z.string().trim().min(1, 'Color is required').max(40, 'Color value is too long'),
})

export type SectionFormValues = z.infer<typeof sectionFormSchema>
