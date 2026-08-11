import { http, HttpResponse } from 'msw'
import { createAccount, createCategory } from '@/test/fixtures/domain'

const API_URL = 'http://localhost:8787'
const TIMESTAMP = '2026-01-15T00:00:00.000Z'

const getPeriod = (month: string) => {
    const [year, monthNumber] = month.split('-').map(Number)
    const lastDay = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate()
    return {
        startDate: `${month}-01`,
        endDate: `${month}-${String(lastDay).padStart(2, '0')}`,
    }
}

export const dashboardHandlers = [
    http.get(`${API_URL}/summary/monthly*`, ({ request }) => {
        const url = new URL(request.url)
        const month = url.searchParams.get('month') || '2026-06'
        const recentLimit = Number(url.searchParams.get('recentLimit') ?? 5)

        if (month === '2026-02') {
            return HttpResponse.json({
                data: {
                    month,
                    period: getPeriod(month),
                    totals: {
                        incomeTotal: 0,
                        expenseTotal: 0,
                        adjustmentTotal: 0,
                        transferTotal: 0,
                        netTotal: 0,
                        transactionCount: 0,
                    },
                    topExpenseCategories: [],
                    topIncomeCategories: [],
                    accountBreakdown: [],
                    recentTransactions: [],
                },
            })
        }

        return HttpResponse.json({
            data: {
                month,
                period: getPeriod(month),
                totals: {
                    incomeTotal: 5000,
                    expenseTotal: 3200,
                    adjustmentTotal: 0,
                    transferTotal: 0,
                    netTotal: 1800,
                    transactionCount: 23,
                },
                topExpenseCategories: [
                    {
                        categoryId: 'c1',
                        name: 'Groceries',
                        icon: 'shopping-bag',
                        section: { id: 's1', name: 'Needs', color: '#3b82f6' },
                        total: 900,
                        transactionCount: 8,
                        percentage: 28,
                    },
                    {
                        categoryId: 'c2',
                        name: 'Rent',
                        icon: null,
                        section: { id: 's1', name: 'Needs', color: '#ef4444' },
                        total: 1200,
                        transactionCount: 1,
                        percentage: 37,
                    },
                ],
                topIncomeCategories: [
                    {
                        categoryId: 'ic1',
                        name: 'Salary',
                        icon: 'dollar-sign',
                        section: null,
                        total: 5000,
                        transactionCount: 1,
                        percentage: 100,
                    },
                ],
                accountBreakdown: [
                    {
                        accountId: createAccount().id,
                        name: createAccount().name,
                        type: createAccount().type,
                        color: createAccount().color,
                        icon: createAccount().icon,
                        incomeTotal: 5000,
                        expenseTotal: 2500,
                        adjustmentTotal: 0,
                        transferInTotal: 0,
                        transferOutTotal: 0,
                        netTotal: 2500,
                        transactionCount: 12,
                    },
                ],
                recentTransactions: [
                    {
                        id: 'tx1',
                        type: 'EXPENSE',
                        amount: 45.5,
                        date: TIMESTAMP,
                        merchant: 'Grocery Store',
                        note: null,
                        accountId: createAccount().id,
                        categoryId: createCategory().id,
                        account: {
                            id: createAccount().id,
                            name: createAccount().name,
                            color: createAccount().color,
                            icon: createAccount().icon,
                        },
                        category: {
                            id: createCategory().id,
                            name: createCategory().name,
                            icon: 'shopping-bag',
                            sectionId: 's1',
                        },
                    },
                    {
                        id: 'tx2',
                        type: 'INCOME',
                        amount: 5000,
                        date: TIMESTAMP,
                        merchant: null,
                        note: 'June salary',
                        accountId: createAccount().id,
                        categoryId: 'ic1',
                        account: {
                            id: createAccount().id,
                            name: createAccount().name,
                            color: createAccount().color,
                            icon: createAccount().icon,
                        },
                        category: { id: 'ic1', name: 'Salary', icon: 'dollar-sign', sectionId: '' },
                    },
                ].slice(0, recentLimit),
            },
        })
    }),
]
