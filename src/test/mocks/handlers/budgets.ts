import { http, HttpResponse } from 'msw'

const API_URL = 'http://localhost:8787'

const now = new Date().toISOString()

const mockBudget = {
    id: 'budget-1',
    month: new Date().toISOString().slice(0, 7),
    amount: 500,
    spent: 150,
    remaining: 350,
    progress: 30,
    isOverBudget: false,
    transactionCount: 3,
    isArchived: false,
    createdAt: now,
    updatedAt: now,
    category: {
        id: 'cat-1',
        name: 'Groceries',
        icon: 'shopping-cart',
        sectionId: 'sec-1',
        section: { id: 'sec-1', name: 'Food', color: '#3b82f6' },
    },
}

export const budgetHandlers = [
    http.get(`${API_URL}/api/v1/budgets`, ({ request }) => {
        // allow query filtering but default to returning a single mock
        const url = new URL(request.url)
        const params = url.searchParams
        if (params.get('includeArchived') === 'true') {
            return HttpResponse.json({ data: [mockBudget] })
        }

        return HttpResponse.json({ data: [mockBudget] })
    }),

    // Sections with categories used by the budgets UI
    http.get(`${API_URL}/api/v1/sections`, ({ request }) => {
        const url = new URL(request.url)
        const includeCategories = url.searchParams.get('includeCategories') === 'true'
        if (includeCategories) {
            const sections = [
                {
                    id: 'sec-1',
                    name: 'Food',
                    color: '#3b82f6',
                    categories: [
                        {
                            id: 'cat-1',
                            name: 'Groceries',
                            icon: 'shopping-cart',
                            sectionId: 'sec-1',
                        },
                    ],
                },
            ]
            return HttpResponse.json({ data: sections })
        }

        return HttpResponse.json({ data: [] })
    }),

    http.post(`${API_URL}/api/v1/budgets`, async ({ request }) => {
        const body = (await request.json()) as Record<string, unknown>
        const created = {
            id: `budget-${Math.random().toString(36).slice(2, 9)}`,
            month: body.month ?? mockBudget.month,
            amount: Number((body as Record<string, unknown>).amount ?? 0),
            spent: 0,
            remaining: Number((body as Record<string, unknown>).amount ?? 0),
            progress: 0,
            isOverBudget: false,
            transactionCount: 0,
            isArchived: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            category: {
                id: body.categoryId ?? mockBudget.category.id,
                name: mockBudget.category.name,
                icon: mockBudget.category.icon,
                sectionId: mockBudget.category.sectionId,
                section: mockBudget.category.section,
            },
        }

        return HttpResponse.json({ data: created }, { status: 201 })
    }),

    http.get(`${API_URL}/api/v1/budgets/:id`, ({ params }) => {
        const id = params.id as string
        if (id === mockBudget.id) return HttpResponse.json({ data: mockBudget })
        return new HttpResponse(null, { status: 404 })
    }),

    http.patch(`${API_URL}/api/v1/budgets/:id`, async ({ request, params }) => {
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
            updatedAt: new Date().toISOString(),
        }
        return HttpResponse.json({ data: updated })
    }),

    http.delete(`${API_URL}/api/v1/budgets/:id`, () => new HttpResponse(null, { status: 204 })),
]
