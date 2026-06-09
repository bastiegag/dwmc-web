export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER' | 'ADJUSTMENT'

export type TransactionAccountSummary = {
    id: string
    name: string
    color: string
    icon: string
}

export type TransactionCategorySummary = {
    id: string
    name: string
    icon: string
    sectionId: string
}

export type Transaction = {
    id: string
    type: TransactionType
    amount: number
    date: string
    merchant: string | null
    note: string | null
    accountId: string | null
    fromAccountId: string | null
    toAccountId: string | null
    categoryId: string | null
    isArchived: boolean
    createdAt: string
    updatedAt: string
    account?: TransactionAccountSummary | null
    fromAccount?: TransactionAccountSummary | null
    toAccount?: TransactionAccountSummary | null
    category?: TransactionCategorySummary | null
}

export type TransactionsMeta = {
    page: number
    pageSize: number
    total: number
    totalPages: number
}

export type GetTransactionsParams = {
    type?: TransactionType
    accountId?: string
    categoryId?: string
    fromAccountId?: string
    toAccountId?: string
    month?: string
    startDate?: string
    endDate?: string
    search?: string
    includeArchived?: boolean
    page?: number
    pageSize?: number
}

export type CreateTransactionPayload =
    | {
          type: 'INCOME'
          amount: number
          date: string
          accountId: string
          categoryId?: string | null
          merchant?: string | null
          note?: string | null
      }
    | {
          type: 'EXPENSE'
          amount: number
          date: string
          accountId: string
          categoryId?: string | null
          merchant?: string | null
          note?: string | null
      }
    | {
          type: 'TRANSFER'
          amount: number
          date: string
          fromAccountId: string
          toAccountId: string
          note?: string | null
      }
    | {
          type: 'ADJUSTMENT'
          amount: number
          date: string
          accountId: string
          note?: string | null
      }

export type UpdateTransactionPayload = {
    type?: TransactionType
    amount?: number
    date?: string
    accountId?: string | null
    fromAccountId?: string | null
    toAccountId?: string | null
    categoryId?: string | null
    merchant?: string | null
    note?: string | null
    isArchived?: boolean
}
