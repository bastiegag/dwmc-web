export type AccountType =
    'CHECKING' | 'SAVINGS' | 'CREDIT_CARD' | 'CASH' | 'INVESTMENT' | 'LOAN' | 'OTHER'

export type Account = {
    id: string
    name: string
    type: AccountType
    startingBalance: number
    currentBalance: number
    goal: number | null
    color: string
    icon: string
    isArchived: boolean
    createdAt: string
    updatedAt: string
}

export type CreateAccountPayload = {
    name: string
    type?: AccountType
    startingBalance?: number
    goal?: number | null
    color: string
    icon: string
}

export type UpdateAccountPayload = {
    name?: string
    type?: AccountType
    startingBalance?: number
    goal?: number | null
    color?: string
    icon?: string
    isArchived?: boolean
}

export type GetAccountsParams = {
    type?: AccountType
    includeArchived?: boolean
}
