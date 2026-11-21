import { z } from 'zod'
import { isSemanticColor, type SemanticColor } from '@/shared/semantic-colors'

export const sectionFormSchema = z.object({
    name: z.string().trim().min(1, 'Section name is required').max(80, 'Section name is too long'),
    color: z.custom<SemanticColor>(isSemanticColor, 'Select a supported color'),
})

export type SectionFormValues = z.infer<typeof sectionFormSchema>
