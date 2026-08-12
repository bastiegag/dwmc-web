export const supportedCurrencies = ['CAD', 'USD', 'EUR'] as const

export type PreferredCurrency = (typeof supportedCurrencies)[number]

export type UserProfile = {
    id: string
    authUserId: string
    firstName: string | null
    lastName: string | null
    displayName: string | null
    preferredCurrency: PreferredCurrency
    createdAt: string
    updatedAt: string
}

export type UpdateProfilePayload = {
    firstName: string | null
    lastName: string | null
    displayName: string | null
    preferredCurrency: PreferredCurrency
}
