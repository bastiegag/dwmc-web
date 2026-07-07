import { http, HttpResponse } from 'msw'
import type {
    CreateTransactionPayload,
    UpdateTransactionPayload,
} from '@/features/transactions/types/transaction.types'

const API_URL = 'http://localhost:8787'

export const transactionHandlers = [
    http.get(`${API_URL}/api/v1/transactions`, () =>
        HttpResponse.json({ data: [], meta: { page: 1, pageSize: 25, total: 0, totalPages: 0 } }),
    ),

    http.get(`${API_URL}/api/v1/transactions/:id`, ({ params }) => {
        const id = params.id as string
        const t = {
            id,
            type: 'EXPENSE',
            amount: 12.34,
            date: new Date().toISOString(),
            merchant: 'Mock merchant',
            note: null,
            accountId: 'a1',
            fromAccountId: null,
            toAccountId: null,
            categoryId: null,
            isArchived: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            account: { id: 'a1', name: 'Checking', color: '#3b82f6', icon: 'wallet' },
        }
        return HttpResponse.json({ data: t })
    }),

    http.post(`${API_URL}/api/v1/transactions`, async ({ request }) => {
        const body = (await request.json()) as CreateTransactionPayload
        const created = {
            id: 'tx-' + String(Math.floor(Math.random() * 10000)),
            ...body,
            isArchived: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
        return HttpResponse.json({ data: created }, { status: 201 })
    }),

    http.patch(`${API_URL}/api/v1/transactions/:id`, async ({ request, params }) => {
        const id = params.id as string
        const body = (await request.json()) as UpdateTransactionPayload
        const updated = {
            id,
            ...body,
            updatedAt: new Date().toISOString(),
        }
        return HttpResponse.json({ data: updated })
    }),

    http.delete(
        `${API_URL}/api/v1/transactions/:id`,
        () => new HttpResponse(null, { status: 204 }),
    ),
]
