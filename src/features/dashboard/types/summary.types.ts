export type GetMonthlySummaryParams = {
    month?: string
    recentLimit?: number
}

export type SummaryCategoryBreakdown = {
    categoryId: string | null
    name: string
    icon: string | null
    section: {
        id: string
        name: string
        color: string
    } | null
    total: number
    transactionCount: number
    percentage: number
}

export type SummaryAccountBreakdown = {
    accountId: string
    name: string
    type: string
    color: string
    icon: string
    incomeTotal: number
    expenseTotal: number
    adjustmentTotal: number
    transferInTotal: number
    transferOutTotal: number
    netTotal: number
    transactionCount: number
}

export type SummaryRecentTransaction = {
    id: string
    type: 'INCOME' | 'EXPENSE' | 'TRANSFER' | 'ADJUSTMENT'
    amount: number
    date: string
    merchant: string | null
    note: string | null
    accountId: string | null
    categoryId: string | null
    account?: {
        id: string
        name: string
        color: string
        icon: string
    } | null
    category?: {
        id: string
        name: string
        icon: string
        sectionId: string
    } | null
}

export type MonthlySummary = {
    month: string
    period: {
        startDate: string
        endDate: string
    }
    totals: {
        incomeTotal: number
        expenseTotal: number
        adjustmentTotal: number
        transferTotal: number
        netTotal: number
        transactionCount: number
    }
    topExpenseCategories: SummaryCategoryBreakdown[]
    topIncomeCategories: SummaryCategoryBreakdown[]
    accountBreakdown: SummaryAccountBreakdown[]
    recentTransactions: SummaryRecentTransaction[]
}
