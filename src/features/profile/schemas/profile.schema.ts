import { z } from 'zod'
import { supportedCurrencies } from '../types/profile.types'

export const profileFormSchema = z.object({
    firstName: z.string().max(80, 'First name must be 80 characters or fewer.'),
    lastName: z.string().max(80, 'Last name must be 80 characters or fewer.'),
    displayName: z.string().max(80, 'Display name must be 80 characters or fewer.'),
    preferredCurrency: z.enum(supportedCurrencies),
})

export type ProfileFormValues = z.infer<typeof profileFormSchema>
