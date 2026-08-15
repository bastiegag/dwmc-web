import { http, HttpResponse } from 'msw'
import { createBudget, createSectionWithCategories } from '@/test/fixtures/domain'

const API_URL = 'http://localhost:8787'
const TIMESTAMP = '2026-01-01T00:00:00.000Z'

const mockBudget = createBudget({
    id: 'budget-groceries',
    month: '2026-06',
    spent: 150,
    remaining: 350,
    progress: 30,
    isOverBudget: false,
})
const julyBudget = createBudget({
    id: 'budget-groceries-july',
    month: '2026-07',
    spent: 150,
    remaining: 350,
    progress: 30,
    isOverBudget: false,
})
const augustBudget = createBudget({
    id: 'budget-groceries-august',
    month: '2026-08',
    spent: 150,
    remaining: 350,
    progress: 30,
    isOverBudget: false,
})

export const budgetHandlers = [
    http.get(`${API_URL}/budgets`, ({ request }) => {
        const url = new URL(request.url)
        const params = url.searchParams
        const includeArchived = params.get('includeArchived') === 'true'
        const month = params.get('month')
        const categoryId = params.get('categoryId')
        const data = [mockBudget, julyBudget, augustBudget].filter(
            (budget) =>
                (includeArchived || !budget.isArchived) &&
                (!month || budget.month === month) &&
                (!categoryId || budget.category.id === categoryId),
        )
        return HttpResponse.json({ data })
    }),

    // Sections with categories used by the budgets UI
    http.get(`${API_URL}/sections`, ({ request }) => {
        const url = new URL(request.url)
        const includeCategories = url.searchParams.get('includeCategories') === 'true'
        if (includeCategories) {
            return HttpResponse.json({ data: [createSectionWithCategories()] })
        }

        return HttpResponse.json({ data: [] })
    }),

    http.post(`${API_URL}/budgets`, async ({ request }) => {
        const body = (await request.json()) as Record<string, unknown>
        const created = {
            id: 'budget-created',
            month: body.month ?? mockBudget.month,
            amount: Number((body as Record<string, unknown>).amount ?? 0),
            spent: 0,
            remaining: Number((body as Record<string, unknown>).amount ?? 0),
            progress: 0,
            isOverBudget: false,
            transactionCount: 0,
            isArchived: false,
            createdAt: TIMESTAMP,
            updatedAt: TIMESTAMP,
            category: body.categoryId === mockBudget.category.id ? mockBudget.category : null,
        }

        return HttpResponse.json({ data: created }, { status: 201 })
    }),

    http.get(`${API_URL}/budgets/:id`, ({ params }) => {
        const id = params.id as string
        if (id === mockBudget.id) return HttpResponse.json({ data: mockBudget })
        return new HttpResponse(null, { status: 404 })
    }),

    http.patch(`${API_URL}/budgets/:id`, async ({ request, params }) => {
        const id = params.id as string
        const body = (await request.json()) as Record<string, unknown>
        const updated = {
            ...mockBudget,
            id,
            month: (body as Record<string, unknown>).month ?? mockBudget.month,
            amount:
                (body as Record<string, unknown>).amount !== undefined
                    ? Number((body as Record<string, unknown>).amount)
                    : mockBudget.amount,
            updatedAt: TIMESTAMP,
        }
        return HttpResponse.json({ data: updated })
    }),

    http.delete(`${API_URL}/budgets/:id`, () => new HttpResponse(null, { status: 204 })),
]
